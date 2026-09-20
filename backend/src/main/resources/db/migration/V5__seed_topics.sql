-- V5: Seed Core Topics & Associate Quizzes

INSERT INTO topics (id, name, slug, description, icon_ref, refresh_frequency) VALUES
(1, 'Artificial Intelligence', 'ai', 'Core principles of machine intelligence, learning algorithms, and agentic workflows.', 'smart_toy', NULL),
(2, 'Large Language Models', 'llms', 'Transformer architectures, prompt engineering, attention mechanisms, and generation.', 'psychology', NULL),
(3, 'General Knowledge', 'general-knowledge', 'World lore, scientific breakthroughs, historical milestones, and tactical wisdom.', 'public', NULL),
(4, 'Current Affairs', 'current-affairs', 'Time-sensitive global events, emerging technologies, and Leaf Village directives.', 'newspaper', 'DAILY'),
(5, 'Business', 'business', 'Strategic economics, mission resource management, venture scaling, and shinobi commerce.', 'trending_up', NULL)
ON CONFLICT (id) DO NOTHING;

SELECT setval('topics_id_seq', (SELECT MAX(id) FROM topics));

-- Associate initial quizzes to topics
UPDATE quizzes SET topic_id = 1 WHERE id = 1; -- Fundamentals of AI -> AI
UPDATE quizzes SET topic_id = 1 WHERE id = 2; -- Neural Networks -> AI
UPDATE quizzes SET topic_id = 2 WHERE id = 3; -- LLM Attention -> LLMs

-- Add quizzes for General Knowledge, Current Affairs, and Business
INSERT INTO quizzes (id, title, slug, description, ninja_rank, time_limit_seconds, passing_score, total_points, chakra_reward, topic_id) VALUES
(4, 'Genin World Lore & General Knowledge Test', 'genin-world-lore-general-knowledge', 'Test your awareness of natural laws, history, and worldly scientific facts.', 'D', 600, 70, 30, 220, 3),
(5, 'Shinobi Intelligence: Weekly Current Affairs Briefing', 'weekly-current-affairs-briefing', 'Live assessment on recent geopolitical shifts, technological disruptions, and trade treaties.', 'C', 600, 70, 30, 300, 4),
(6, 'Jonin Strategy: Shinobi Business & Village Economics', 'shinobi-business-village-economics', 'Financial strategy, resource allocation, and squad contract negotiations.', 'A', 900, 80, 30, 750, 5)
ON CONFLICT (id) DO NOTHING;

SELECT setval('quizzes_id_seq', (SELECT MAX(id) FROM quizzes));

-- Questions for Quiz 4 (General Knowledge)
INSERT INTO questions (quiz_id, question_text, question_type, options, correct_answer, rubric, points, order_num) VALUES
(4, 'What is the primary chemical element responsible for cellular energy production in aerobic organisms?', 'MULTIPLE_CHOICE', '["Oxygen", "Nitrogen", "Argon", "Helium"]'::jsonb, 'Oxygen', 'Oxygen acts as the final electron acceptor in cellular respiration.', 10, 1),
(4, 'True or False: The speed of light in a vacuum is approximately 300,000 kilometers per second.', 'TRUE_FALSE', '["True", "False"]'::jsonb, 'True', 'Light speed c is approximately 299,792 km/s in vacuum.', 10, 2),
(4, 'Describe why biodiversity is critical for the resilience of ecological food webs.', 'SHORT_ANSWER', '[]'::jsonb, 'Biodiversity provides redundancy and functional adaptability, ensuring ecosystems withstand environmental stressors.', 'Must highlight redundancy, ecosystem stability, food web complexity, and resistance to environmental perturbations.', 10, 3);

-- Questions for Quiz 5 (Current Affairs)
INSERT INTO questions (quiz_id, question_text, question_type, options, correct_answer, rubric, points, order_num) VALUES
(5, 'What renewable energy source experienced the highest global generation growth over the past decade?', 'MULTIPLE_CHOICE', '["Solar Photovoltaic", "Geothermal", "Coal", "Nuclear Fission"]'::jsonb, 'Solar Photovoltaic', 'Solar PV expanded faster in capacity additions than any other power source.', 10, 1),
(5, 'True or False: Central Bank Digital Currencies (CBDCs) are identical in governance to decentralized cryptocurrencies like Bitcoin.', 'TRUE_FALSE', '["True", "False"]'::jsonb, 'False', 'CBDCs are centralized fiat currencies issued and controlled by sovereign central banks.', 10, 2),
(5, 'Explain how recent advancements in multimodal AI impact real-time automated news analysis.', 'SHORT_ANSWER', '[]'::jsonb, 'Multimodal models integrate text, audio, satellite, and video feeds concurrently to cross-verify claims and generate syntheses in real-time.', 'Rubric: Mentions multimodal cross-verification, real-time synthesis of multi-format media, and reduction in analytical latency.', 10, 3);

-- Questions for Quiz 6 (Business)
INSERT INTO questions (quiz_id, question_text, question_type, options, correct_answer, rubric, points, order_num) VALUES
(6, 'What metric calculates the net profit generated relative to the capital invested in a mission venture?', 'MULTIPLE_CHOICE', '["ROI (Return on Investment)", "EBITDA Margin Only", "Churn Velocity", "Gross Headcount"]'::jsonb, 'ROI (Return on Investment)', 'ROI = (Net Return / Investment Cost) * 100.', 10, 1),
(6, 'True or False: A higher Customer Acquisition Cost (CAC) than Lifetime Value (LTV) indicates a sustainable long-term business model.', 'TRUE_FALSE', '["True", "False"]'::jsonb, 'False', 'A viable business requires LTV significantly exceeding CAC (typically 3:1 ratio).', 10, 2),
(6, 'Analyze the strategic trade-offs between vertical integration and outsourcing critical operational workflows.', 'SHORT_ANSWER', '[]'::jsonb, 'Vertical integration grants quality control and intellectual property security but increases fixed overhead; outsourcing offers agility and lower capital expenditure at the risk of supply chain dependencies.', 'Rubric: Explains pros/cons of control/overhead (vertical) versus agility/dependency risks (outsourcing).', 10, 3);
