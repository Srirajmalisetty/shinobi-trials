package com.app.quizsystem.service;

import com.app.quizsystem.dto.*;
import com.app.quizsystem.exception.ResourceNotFoundException;
import com.app.quizsystem.grading.GradingResult;
import com.app.quizsystem.model.*;
import com.app.quizsystem.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SubmissionService {

    private static final Logger log = LoggerFactory.getLogger(SubmissionService.class);

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final SubmissionRepository submissionRepository;
    private final SubmissionAnswerRepository submissionAnswerRepository;
    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final GradingService gradingService;
    private final CertificateService certificateService;

    public SubmissionService(QuizRepository quizRepository,
                             QuestionRepository questionRepository,
                             SubmissionRepository submissionRepository,
                             SubmissionAnswerRepository submissionAnswerRepository,
                             CertificateRepository certificateRepository,
                             UserRepository userRepository,
                             UserService userService,
                             GradingService gradingService,
                             CertificateService certificateService) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.submissionRepository = submissionRepository;
        this.submissionAnswerRepository = submissionAnswerRepository;
        this.certificateRepository = certificateRepository;
        this.userRepository = userRepository;
        this.userService = userService;
        this.gradingService = gradingService;
        this.certificateService = certificateService;
    }

    @Transactional
    public QuizStartResponseDTO startQuizAttempt(Long quizId, String username) {
        return startQuizAttempt(quizId, null, username);
    }

    @Transactional
    public QuizStartResponseDTO startQuizAttempt(Long quizId, UUID userId, String username) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz trial not found with id: " + quizId));

        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        } else if (username != null && !username.isBlank()) {
            user = userRepository.findByUsername(username).orElse(null);
        }

        Instant startedAt = Instant.now();
        Instant expiresAt = startedAt.plusSeconds(quiz.getTimeLimitSeconds());

        Submission submission = Submission.builder()
                .quizId(quiz.getId())
                .userId(user != null ? user.getId() : null)
                .studentName(user != null ? user.getUsername() : "Shinobi Candidate")
                .studentEmail(user != null ? user.getEmail() : null)
                .timeSpentSeconds(0)
                .startedAt(startedAt)
                .expiresAt(expiresAt)
                .status("IN_PROGRESS")
                .score(0)
                .totalPossible(0)
                .percentage(0.0)
                .passed(false)
                .submittedAt(startedAt)
                .build();

        submission = submissionRepository.save(submission);
        log.info("Initiated quiz attempt id={} for quiz={} with server expiry={}", submission.getId(), quizId, expiresAt);

        return new QuizStartResponseDTO(
                submission.getId(),
                quiz.getId(),
                quiz.getTitle(),
                quiz.getTimeLimitSeconds(),
                startedAt,
                expiresAt
        );
    }

    @Transactional
    public SubmissionResponseDTO processSubmission(SubmissionRequestDTO request, UUID currentUserId, String username) {
        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + request.getQuizId()));

        User user = null;
        if (currentUserId != null) {
            user = userRepository.findById(currentUserId).orElse(null);
        } else if (username != null && !username.isBlank()) {
            user = userRepository.findByUsername(username).orElse(null);
        }

        Submission submission;
        if (request.getAttemptId() != null) {
            submission = submissionRepository.findById(request.getAttemptId())
                    .orElse(null);
            if (submission != null) {
                // Server-side timer expiry validation (15 seconds grace period)
                if (submission.getExpiresAt() != null && Instant.now().isAfter(submission.getExpiresAt().plusSeconds(15))) {
                    log.warn("Submission attempt {} exceeded server expiry timestamp {}", submission.getId(), submission.getExpiresAt());
                    submission.setStatus("TIMED_OUT");
                }
            } else {
                submission = createNewSubmission(request, quiz, user);
            }
        } else {
            submission = createNewSubmission(request, quiz, user);
        }

        if (user != null) {
            submission.setUserId(user.getId());
            submission.setStudentName(user.getUsername());
            submission.setStudentEmail(user.getEmail());
        } else {
            submission.setStudentName(request.getStudentName() != null ? request.getStudentName() : "Shinobi Candidate");
            submission.setStudentEmail(request.getStudentEmail());
        }

        submission.setTimeSpentSeconds(request.getTimeSpentSeconds() != null ? request.getTimeSpentSeconds() : 0);
        submission.setSubmittedAt(Instant.now());

        List<Question> questions;
        if (request.getAnswers() != null && !request.getAnswers().isEmpty()) {
            List<Long> questionIds = request.getAnswers().stream()
                    .map(AnswerSubmissionDTO::getQuestionId)
                    .collect(Collectors.toList());
            questions = questionRepository.findAllById(questionIds);
        } else {
            questions = questionRepository.findByQuizIdOrderByOrderNumAsc(quiz.getId());
        }

        Map<Long, Question> questionMap = questions.stream()
                .collect(Collectors.toMap(Question::getId, q -> q));

        Map<Long, String> studentAnswers = new HashMap<>();
        if (request.getAnswers() != null) {
            for (AnswerSubmissionDTO a : request.getAnswers()) {
                studentAnswers.put(a.getQuestionId(), a.getAnswer());
            }
        }

        int totalEarned = 0;
        int totalPossible = 0;
        List<AnswerResultDTO> answerResults = new ArrayList<>();

        for (Question q : questions) {
            String studentAns = studentAnswers.getOrDefault(q.getId(), "");
            GradingResult result = gradingService.gradeAnswer(q, studentAns);

            totalEarned += result.getScore();
            totalPossible += q.getPoints();

            SubmissionAnswer sa = new SubmissionAnswer(
                    null,
                    submission.getId(),
                    q.getId(),
                    studentAns,
                    result.getScore(),
                    q.getPoints(),
                    result.getIsCorrect(),
                    result.getAiGraded(),
                    result.getExplanation(),
                    false,
                    null,
                    null,
                    Instant.now()
            );
            submissionAnswerRepository.save(sa);

            answerResults.add(AnswerResultDTO.builder()
                    .questionId(q.getId())
                    .questionText(q.getQuestionText())
                    .questionType(q.getQuestionType())
                    .studentAnswer(studentAns)
                    .correctAnswer(q.getCorrectAnswer())
                    .scoreAwarded(result.getScore())
                    .maxScore(q.getPoints())
                    .isCorrect(result.getIsCorrect())
                    .aiGraded(result.getAiGraded())
                    .aiExplanation(result.getExplanation())
                    .build());
        }

        double percentage = totalPossible > 0 ? ((double) totalEarned / totalPossible) * 100.0 : 0.0;
        boolean passed = percentage >= quiz.getPassingScore();

        NinjaRank rankAwarded = passed ? quiz.getNinjaRank() : NinjaRank.D;
        int chakraEarned = passed ? quiz.getChakraReward() : (int) (quiz.getChakraReward() * 0.2);

        submission.setScore(totalEarned);
        submission.setTotalPossible(totalPossible);
        submission.setPercentage(percentage);
        submission.setPassed(passed);
        submission.setRankAwarded(rankAwarded);
        if (!"TIMED_OUT".equals(submission.getStatus())) {
            submission.setStatus("COMPLETED");
        }
        submission = submissionRepository.save(submission);

        // If user is authenticated, award Chakra Ryo and rank update
        if (user != null) {
            userService.awardChakraRyo(user.getId(), chakraEarned);
            if (passed) {
                userService.updateNinjaRank(user.getId(), rankAwarded.name());
            }
        }

        String certificateCode = null;
        if (passed) {
            Certificate certificate = certificateService.createCertificate(submission, quiz);
            certificateCode = certificate.getCertificateCode();
        }

        String topicName = quiz.getTopic() != null ? quiz.getTopic().getName() : "Leaf Academy Jutsu";

        return SubmissionResponseDTO.builder()
                .submissionId(submission.getId())
                .quizId(quiz.getId())
                .quizTitle(quiz.getTitle())
                .topicName(topicName)
                .studentName(submission.getStudentName())
                .studentEmail(submission.getStudentEmail())
                .score(totalEarned)
                .totalPossible(totalPossible)
                .percentage(percentage)
                .passed(passed)
                .passingScore(quiz.getPassingScore())
                .rankAwarded(rankAwarded)
                .chakraEarned(chakraEarned)
                .timeSpentSeconds(submission.getTimeSpentSeconds())
                .submittedAt(submission.getSubmittedAt())
                .certificateCode(certificateCode)
                .results(answerResults)
                .build();
    }

    private Submission createNewSubmission(SubmissionRequestDTO request, Quiz quiz, User user) {
        Instant now = Instant.now();
        Submission s = Submission.builder()
                .quizId(quiz.getId())
                .userId(user != null ? user.getId() : null)
                .studentName(user != null ? user.getUsername() : (request.getStudentName() != null ? request.getStudentName() : "Shinobi Candidate"))
                .studentEmail(user != null ? user.getEmail() : request.getStudentEmail())
                .timeSpentSeconds(request.getTimeSpentSeconds() != null ? request.getTimeSpentSeconds() : 0)
                .startedAt(now)
                .expiresAt(now.plusSeconds(quiz.getTimeLimitSeconds()))
                .status("COMPLETED")
                .submittedAt(now)
                .build();
        return submissionRepository.save(s);
    }

    @Transactional(readOnly = true)
    public SubmissionResponseDTO getSubmissionById(Long id) {
        return getSubmissionResponse(id);
    }

    @Transactional(readOnly = true)
    public SubmissionResponseDTO getSubmissionById(Long id, UUID currentUserId, boolean isAdmin) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission record not found with id: " + id));

        if (!isAdmin && submission.getUserId() != null && currentUserId != null && !submission.getUserId().equals(currentUserId)) {
            throw new AccessDeniedException("Access denied: You cannot view another candidate's exam records.");
        }

        return buildSubmissionResponseDTO(submission);
    }

    private SubmissionResponseDTO getSubmissionResponse(Long id) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission record not found with id: " + id));
        return buildSubmissionResponseDTO(submission);
    }

    private SubmissionResponseDTO buildSubmissionResponseDTO(Submission submission) {
        Quiz quiz = quizRepository.findById(submission.getQuizId()).orElse(null);
        String quizTitle = quiz != null ? quiz.getTitle() : "Shinobi Trial";
        String topicName = (quiz != null && quiz.getTopic() != null) ? quiz.getTopic().getName() : "Shinobi Jutsu";
        Integer passingScore = quiz != null ? quiz.getPassingScore() : 70;
        int chakraEarned = submission.getPassed() ? (quiz != null ? quiz.getChakraReward() : 200) : 40;

        List<SubmissionAnswer> answers = submissionAnswerRepository.findBySubmissionId(submission.getId());
        List<AnswerResultDTO> answerResults = answers.stream().map(a -> {
            Question q = questionRepository.findById(a.getQuestionId()).orElse(null);
            return AnswerResultDTO.builder()
                    .questionId(a.getQuestionId())
                    .questionText(q != null ? q.getQuestionText() : "Question #" + a.getQuestionId())
                    .questionType(q != null ? q.getQuestionType() : QuestionType.MULTIPLE_CHOICE)
                    .studentAnswer(a.getStudentAnswer())
                    .correctAnswer(q != null ? q.getCorrectAnswer() : "")
                    .scoreAwarded(a.getScoreAwarded())
                    .maxScore(a.getMaxScore())
                    .isCorrect(a.getIsCorrect())
                    .aiGraded(a.getAiGraded())
                    .aiExplanation(a.getAiExplanation())
                    .build();
        }).collect(Collectors.toList());

        Certificate cert = certificateRepository.findBySubmissionId(submission.getId()).orElse(null);
        String certCode = cert != null ? cert.getCertificateCode() : null;

        return SubmissionResponseDTO.builder()
                .submissionId(submission.getId())
                .quizId(submission.getQuizId())
                .quizTitle(quizTitle)
                .topicName(topicName)
                .studentName(submission.getStudentName())
                .studentEmail(submission.getStudentEmail())
                .score(submission.getScore())
                .totalPossible(submission.getTotalPossible())
                .percentage(submission.getPercentage())
                .passed(submission.getPassed())
                .passingScore(passingScore)
                .rankAwarded(submission.getRankAwarded())
                .chakraEarned(chakraEarned)
                .timeSpentSeconds(submission.getTimeSpentSeconds())
                .submittedAt(submission.getSubmittedAt())
                .certificateCode(certCode)
                .results(answerResults)
                .build();
    }

    @Transactional(readOnly = true)
    public DashboardStatsDTO getDashboardStats(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        List<Submission> userSubmissions = submissionRepository.findByUserIdOrderBySubmittedAtDesc(user.getId());

        long totalAttempts = userSubmissions.size();
        long passedTrials = userSubmissions.stream().filter(Submission::getPassed).count();
        double avgScore = userSubmissions.isEmpty() ? 0.0 :
                userSubmissions.stream().mapToDouble(Submission::getPercentage).average().orElse(0.0);

        List<SubmissionResponseDTO> recent = userSubmissions.stream()
                .limit(10)
                .map(this::buildSubmissionResponseDTO)
                .collect(Collectors.toList());

        List<CertificateDTO> certificates = certificateRepository.findByUserIdOrderByIssuedAtDesc(user.getId()).stream()
                .map(CertificateDTO::fromEntity)
                .collect(Collectors.toList());

        return new DashboardStatsDTO(
                UserDTO.fromEntity(user),
                totalAttempts,
                passedTrials,
                avgScore,
                user.getXp(),
                recent,
                certificates
        );
    }

    @Transactional(readOnly = true)
    public DashboardStatsDTO getDashboardStats(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return getDashboardStats(user.getId());
    }
}
