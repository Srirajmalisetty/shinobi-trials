package com.app.quizsystem.service;

import com.app.quizsystem.dto.AdminOverrideDTO;
import com.app.quizsystem.dto.AdminQuizCreateDTO;
import com.app.quizsystem.dto.AiReviewDTO;
import com.app.quizsystem.dto.QuizDetailDTO;
import com.app.quizsystem.exception.ResourceNotFoundException;
import com.app.quizsystem.model.Question;
import com.app.quizsystem.model.Quiz;
import com.app.quizsystem.model.Submission;
import com.app.quizsystem.model.SubmissionAnswer;
import com.app.quizsystem.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final TopicRepository topicRepository;
    private final SubmissionAnswerRepository submissionAnswerRepository;
    private final SubmissionRepository submissionRepository;
    private final CertificateService certificateService;
    private final ObjectMapper objectMapper;

    public AdminService(QuizRepository quizRepository,
                        QuestionRepository questionRepository,
                        TopicRepository topicRepository,
                        SubmissionAnswerRepository submissionAnswerRepository,
                        SubmissionRepository submissionRepository,
                        CertificateService certificateService,
                        ObjectMapper objectMapper) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.topicRepository = topicRepository;
        this.submissionAnswerRepository = submissionAnswerRepository;
        this.submissionRepository = submissionRepository;
        this.certificateService = certificateService;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public QuizDetailDTO createQuiz(AdminQuizCreateDTO request) {
        topicRepository.findById(request.getTopicId())
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + request.getTopicId()));

        String slug = generateSlug(request.getTitle());

        int totalPoints = request.getQuestions().stream()
                .mapToInt(q -> q.getPoints() != null ? q.getPoints() : 10)
                .sum();

        Quiz quiz = Quiz.builder()
                .topicId(request.getTopicId())
                .title(request.getTitle())
                .slug(slug)
                .description(request.getDescription())
                .ninjaRank(request.getNinjaRank())
                .timeLimitSeconds(request.getTimeLimitSeconds())
                .passingScore(request.getPassingScore())
                .totalPoints(totalPoints)
                .chakraReward(request.getChakraReward())
                .active(true)
                .createdAt(Instant.now())
                .build();

        quiz = quizRepository.save(quiz);

        int order = 1;
        for (AdminQuizCreateDTO.AdminQuestionCreateDTO qDto : request.getQuestions()) {
            String optionsJson = "[]";
            if (qDto.getOptions() != null) {
                try {
                    optionsJson = objectMapper.writeValueAsString(qDto.getOptions());
                } catch (Exception ignored) {}
            }

            Question question = Question.builder()
                    .quizId(quiz.getId())
                    .questionText(qDto.getQuestionText())
                    .questionType(qDto.getQuestionType())
                    .options(optionsJson)
                    .correctAnswer(qDto.getCorrectAnswer())
                    .rubric(qDto.getRubric())
                    .points(qDto.getPoints() != null ? qDto.getPoints() : 10)
                    .orderNum(order++)
                    .createdAt(Instant.now())
                    .build();

            questionRepository.save(question);
        }

        return QuizDetailDTO.fromEntityWithQuestions(quizRepository.findById(quiz.getId()).orElseThrow());
    }

    @Transactional(readOnly = true)
    public List<AiReviewDTO> getAiGradingReviews() {
        List<SubmissionAnswer> answers = submissionAnswerRepository.findByAiGradedTrueOrderByCreatedAtDesc();
        return answers.stream()
                .map(AiReviewDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public AiReviewDTO overrideAiGrade(Long answerId, AdminOverrideDTO overrideDTO) {
        SubmissionAnswer answer = submissionAnswerRepository.findById(answerId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission answer not found: " + answerId));

        answer.setScoreAwarded(overrideDTO.getScoreAwarded());
        answer.setIsCorrect(overrideDTO.getScoreAwarded() >= Math.ceil(answer.getMaxScore() * 0.7));
        answer.setAdminOverridden(true);
        answer.setAdminFeedback(overrideDTO.getAdminFeedback());
        answer.setReviewedBy(overrideDTO.getReviewedBy() != null ? overrideDTO.getReviewedBy() : "Academy Admin");

        answer = submissionAnswerRepository.save(answer);

        // Recalculate parent submission total score
        Submission submission = answer.getSubmission();
        if (submission != null) {
            List<SubmissionAnswer> allAnswers = submissionAnswerRepository.findBySubmissionId(submission.getId());
            int newTotal = allAnswers.stream().mapToInt(SubmissionAnswer::getScoreAwarded).sum();
            submission.setScore(newTotal);
            double percentage = submission.getTotalPossible() > 0 ? ((double) newTotal / submission.getTotalPossible()) * 100.0 : 0.0;
            submission.setPercentage(percentage);

            Quiz quiz = submission.getQuiz();
            boolean passed = quiz != null && percentage >= quiz.getPassingScore();
            submission.setPassed(passed);
            submissionRepository.save(submission);

            if (passed && quiz != null) {
                certificateService.createCertificate(submission, quiz);
            }
        }

        return AiReviewDTO.fromEntity(answer);
    }

    private String generateSlug(String title) {
        String base = title.toLowerCase(Locale.ENGLISH)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "");
        String candidate = base;
        int count = 1;
        while (quizRepository.findBySlug(candidate).isPresent()) {
            candidate = base + "-" + (++count);
        }
        return candidate;
    }
}
