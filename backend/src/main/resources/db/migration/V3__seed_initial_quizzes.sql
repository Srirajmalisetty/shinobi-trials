-- V3: Initial Seed Data for Ninja Trials

INSERT INTO quizzes (id, title, slug, description, ninja_rank, time_limit_seconds, passing_score, total_points, chakra_reward) VALUES
(1, 'Ninja Academy Exam: Fundamentals of Chakra & AI', 'fundamentals-of-chakra-ai', 'Demonstrate your grasp of core intelligence concepts and academy principles.', 'D', 600, 70, 30, 200),
(2, 'Chūnin Selection: Neural Networks & Jutsus', 'neural-networks-jutsus', 'Rigorous theoretical and applied assessment on deep neural architectures and optimization.', 'C', 900, 75, 30, 450),
(3, 'Special Jonin Protocol: LLM Attention & Transformer Seals', 'llm-attention-transformer-seals', 'Advanced examination of multi-head self-attention mechanics and context retrieval.', 'B', 1200, 80, 30, 800)
ON CONFLICT (id) DO NOTHING;

-- Questions for Quiz 1 (Fundamentals of Chakra & AI)
INSERT INTO questions (quiz_id, question_text, question_type, options, correct_answer, rubric, points, order_num) VALUES
(1, 'Which of the following is considered a core supervised learning task in ninja telemetry?', 'MULTIPLE_CHOICE', '["Classification", "K-Means Clustering", "Random Walk", "Chakra Diffusion"]'::jsonb, 'Classification', 'Option A is supervised learning where ground truth labels are provided.', 10, 1),
(1, 'True or False: A higher learning rate always guarantees faster convergence to global minimum without risk of overshooting.', 'TRUE_FALSE', '["True", "False"]'::jsonb, 'False', 'High learning rates frequently cause oscillations or divergence away from optimal minima.', 10, 2),
(1, 'Explain the purpose of gradient descent in training artificial intelligence models and how step size affects weight updates.', 'SHORT_ANSWER', '[]'::jsonb, 'Gradient descent minimizes the loss function iteratively by updating weights in the opposite direction of gradients scaled by the learning rate.', 'Score 10: Mentions loss function minimization, negative gradient direction, and learning rate impact. Score 5-9: Partially explains minimization but misses learning rate mechanics. Score 0-4: Irrelevant or vague.', 10, 3);

-- Questions for Quiz 2 (Chunin Selection)
INSERT INTO questions (quiz_id, question_text, question_type, options, correct_answer, rubric, points, order_num) VALUES
(2, 'What activation function prevents vanishing gradients by outputting max(0, x)?', 'MULTIPLE_CHOICE', '["Sigmoid", "Tanh", "ReLU", "Softmax"]'::jsonb, 'ReLU', 'Rectified Linear Unit preserves positive gradient flow without saturating.', 10, 1),
(2, 'True or False: Dropout during training temporarily deactivates random neuron units to prevent model overfitting.', 'TRUE_FALSE', '["True", "False"]'::jsonb, 'True', 'Dropout acts as an ensemble regularization technique by zeroing random activation activations.', 10, 2),
(2, 'How does backpropagation compute gradients through hidden layers, and why is the chain rule essential?', 'SHORT_ANSWER', '[]'::jsonb, 'Backpropagation uses the calculus chain rule to calculate the partial derivatives of the loss function with respect to each weight from output backwards through layers.', 'Must mention chain rule, partial derivatives with respect to weights, backward pass from output to input layers.', 10, 3);

-- Questions for Quiz 3 (Special Jonin Protocol)
INSERT INTO questions (quiz_id, question_text, question_type, options, correct_answer, rubric, points, order_num) VALUES
(3, 'In the Transformer architecture, what is the computational complexity of standard self-attention with respect to sequence length N?', 'MULTIPLE_CHOICE', '["O(N)", "O(N log N)", "O(N^2)", "O(2^N)"]'::jsonb, 'O(N^2)', 'Self-attention computes dot products between all pairs of tokens in the sequence length N.', 10, 1),
(3, 'True or False: Positional encodings are needed in Transformers because standard self-attention is permutation-invariant.', 'TRUE_FALSE', '["True", "False"]'::jsonb, 'True', 'Self-attention treats tokens as an unordered set without explicit position vectors.', 10, 2),
(3, 'Explain the roles of Query, Key, and Value vectors in scaled dot-product attention.', 'SHORT_ANSWER', '[]'::jsonb, 'Queries represent the token asking for context, Keys represent the reference addresses to match against, and Values are the retrieved features weighted by the softmax of Q dot K transpose scaled by sqrt(d_k).', 'Rubric: Clearly describes Q as inquiry/focus, K as index/match target, and V as content payload combined via attention weights.', 10, 3);

SELECT setval('quizzes_id_seq', (SELECT MAX(id) FROM quizzes));
