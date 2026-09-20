package com.app.quizsystem.service;

import com.app.quizsystem.dto.QuizDTO;
import com.app.quizsystem.dto.TopicDTO;
import com.app.quizsystem.exception.ResourceNotFoundException;
import com.app.quizsystem.model.Quiz;
import com.app.quizsystem.model.Topic;
import com.app.quizsystem.repository.QuizRepository;
import com.app.quizsystem.repository.TopicRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TopicService {

    private final TopicRepository topicRepository;
    private final QuizRepository quizRepository;

    public TopicService(TopicRepository topicRepository, QuizRepository quizRepository) {
        this.topicRepository = topicRepository;
        this.quizRepository = quizRepository;
    }

    @Transactional(readOnly = true)
    public List<TopicDTO> getAllTopics() {
        List<Topic> topics = topicRepository.findAll();
        List<Quiz> activeQuizzes = quizRepository.findByActiveTrue();

        Map<Long, Long> quizCounts = activeQuizzes.stream()
                .filter(q -> q.getTopicId() != null)
                .collect(Collectors.groupingBy(Quiz::getTopicId, Collectors.counting()));

        return topics.stream()
                .map(topic -> TopicDTO.fromEntity(topic, quizCounts.getOrDefault(topic.getId(), 0L)))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TopicDTO getTopicBySlug(String slug) {
        Topic topic = topicRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with slug: " + slug));

        long count = quizRepository.findByTopicId(topic.getId()).stream()
                .filter(Quiz::getActive)
                .count();

        return TopicDTO.fromEntity(topic, count);
    }

    @Transactional(readOnly = true)
    public List<QuizDTO> getQuizzesByTopicSlug(String slug) {
        Topic topic = topicRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with slug: " + slug));

        return quizRepository.findByTopicId(topic.getId()).stream()
                .filter(Quiz::getActive)
                .map(QuizDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
