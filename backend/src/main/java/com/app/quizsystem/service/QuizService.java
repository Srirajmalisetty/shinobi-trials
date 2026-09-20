package com.app.quizsystem.service;

import com.app.quizsystem.dto.QuizDTO;
import com.app.quizsystem.dto.QuizDetailDTO;
import com.app.quizsystem.exception.ResourceNotFoundException;
import com.app.quizsystem.model.NinjaRank;
import com.app.quizsystem.model.Question;
import com.app.quizsystem.model.Quiz;
import com.app.quizsystem.repository.QuizRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionGenerationService questionGenerationService;

    public QuizService(QuizRepository quizRepository, QuestionGenerationService questionGenerationService) {
        this.quizRepository = quizRepository;
        this.questionGenerationService = questionGenerationService;
    }

    @Transactional(readOnly = true)
    public List<QuizDTO> getQuizzes(Long topicId, NinjaRank rank) {
        List<Quiz> quizzes = quizRepository.searchQuizzes(topicId, rank);
        return quizzes.stream()
                .map(QuizDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<QuizDTO> getQuizzesByRank(NinjaRank rank) {
        return quizRepository.findByNinjaRank(rank).stream()
                .filter(Quiz::getActive)
                .map(QuizDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public QuizDetailDTO getQuizById(Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + id));
        List<Question> questions = questionGenerationService.generateOrFetchQuestions(quiz);
        return QuizDetailDTO.fromEntityWithCustomQuestions(quiz, questions);
    }

    @Transactional
    public QuizDetailDTO getQuizBySlug(String slug) {
        Quiz quiz = quizRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with slug: " + slug));
        List<Question> questions = questionGenerationService.generateOrFetchQuestions(quiz);
        return QuizDetailDTO.fromEntityWithCustomQuestions(quiz, questions);
    }
}
