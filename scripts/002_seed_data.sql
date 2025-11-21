-- Insert sample tips
INSERT INTO public.tips (title, content, category) VALUES
('Verify Sender Email Address', 'Always check the sender''s email address carefully. Phishers often use addresses that look similar to legitimate ones but with slight variations. Hover over the sender name to see the actual email address.', 'Email Security'),
('Look for Suspicious Links', 'Before clicking any link, hover over it to see the actual URL. Phishing emails often contain links that appear to go to legitimate sites but actually redirect to malicious ones.', 'Link Safety'),
('Check for Urgency and Threats', 'Be wary of emails that create a sense of urgency or threaten negative consequences. Legitimate companies rarely pressure you to act immediately or threaten account closure.', 'Social Engineering'),
('Verify Requests for Personal Information', 'Legitimate companies will never ask for passwords, credit card numbers, or social security numbers via email. If you receive such a request, contact the company directly using a known phone number or website.', 'Data Protection'),
('Examine Attachments Carefully', 'Don''t open attachments from unknown senders. Even if the sender appears legitimate, verify with them before opening suspicious files. Malware is often distributed through email attachments.', 'Malware Prevention'),
('Check for Grammar and Spelling Errors', 'Professional companies proofread their emails. Phishing emails often contain grammar, spelling, or formatting errors. These are red flags that the email may not be legitimate.', 'Content Analysis'),
('Use Multi-Factor Authentication', 'Enable multi-factor authentication (MFA) on all important accounts. Even if a phisher obtains your password, they won''t be able to access your account without the second factor.', 'Account Security'),
('Verify Unexpected Requests', 'If you receive an unexpected request for information or action, contact the organization directly using a phone number or website you know is legitimate. Don''t use contact information from the suspicious email.', 'Verification');

-- Insert sample quizzes
INSERT INTO public.quizzes (title, description, category, difficulty) VALUES
('Phishing Email Basics', 'Learn to identify common phishing email tactics and red flags', 'Phishing', 'Beginner'),
('Advanced Phishing Detection', 'Master advanced techniques to spot sophisticated phishing attempts', 'Phishing', 'Intermediate'),
('Real-World Phishing Scenarios', 'Test your skills with realistic phishing scenarios', 'Phishing', 'Advanced');

-- Get quiz IDs for inserting questions
WITH quiz_ids AS (
  SELECT id, title FROM public.quizzes ORDER BY created_at
)
INSERT INTO public.questions (quiz_id, question_text, correct_answer, explanation)
SELECT 
  (SELECT id FROM public.quizzes WHERE title = 'Phishing Email Basics' LIMIT 1),
  'What is the first thing you should check in a suspicious email?',
  'The sender''s email address',
  'Always verify the sender''s email address first. Phishers often use addresses that look similar to legitimate ones but with slight variations.'
UNION ALL
SELECT 
  (SELECT id FROM public.quizzes WHERE title = 'Phishing Email Basics' LIMIT 1),
  'What should you do if an email asks for your password?',
  'Never provide it and report the email',
  'Legitimate companies never ask for passwords via email. This is a major red flag for phishing attempts.'
UNION ALL
SELECT 
  (SELECT id FROM public.quizzes WHERE title = 'Phishing Email Basics' LIMIT 1),
  'How can you verify a suspicious link before clicking?',
  'Hover over the link to see the actual URL',
  'Hovering over links reveals the true destination URL. Phishing emails often disguise malicious links with legitimate-looking text.'
UNION ALL
SELECT 
  (SELECT id FROM public.quizzes WHERE title = 'Advanced Phishing Detection' LIMIT 1),
  'What is a common technique used in spear phishing?',
  'Using personal information to make the email seem legitimate',
  'Spear phishing uses researched personal details to increase credibility and bypass skepticism.'
UNION ALL
SELECT 
  (SELECT id FROM public.quizzes WHERE title = 'Advanced Phishing Detection' LIMIT 1),
  'What does DKIM help protect against?',
  'Email spoofing and tampering',
  'DKIM (DomainKeys Identified Mail) digitally signs emails to verify they come from the claimed domain.'
UNION ALL
SELECT 
  (SELECT id FROM public.quizzes WHERE title = 'Real-World Phishing Scenarios' LIMIT 1),
  'You receive an email from "PayPal" asking to verify your account. What should you do?',
  'Go directly to PayPal.com without clicking the email link',
  'Always access accounts directly through the official website or app, never through email links. This prevents credential theft.'
;

-- Insert answer options for questions
WITH q1 AS (
  SELECT id FROM public.questions WHERE question_text = 'What is the first thing you should check in a suspicious email?' LIMIT 1
)
INSERT INTO public.answer_options (question_id, option_text, is_correct)
SELECT q1.id, 'The sender''s email address', true FROM q1
UNION ALL
SELECT q1.id, 'The subject line', false FROM q1
UNION ALL
SELECT q1.id, 'The signature', false FROM q1
UNION ALL
SELECT q1.id, 'The date sent', false FROM q1;

WITH q2 AS (
  SELECT id FROM public.questions WHERE question_text = 'What should you do if an email asks for your password?' LIMIT 1
)
INSERT INTO public.answer_options (question_id, option_text, is_correct)
SELECT q2.id, 'Never provide it and report the email', true FROM q2
UNION ALL
SELECT q2.id, 'Provide it if the email looks professional', false FROM q2
UNION ALL
SELECT q2.id, 'Ask a colleague first', false FROM q2
UNION ALL
SELECT q2.id, 'Change your password first then provide it', false FROM q2;

WITH q3 AS (
  SELECT id FROM public.questions WHERE question_text = 'How can you verify a suspicious link before clicking?' LIMIT 1
)
INSERT INTO public.answer_options (question_id, option_text, is_correct)
SELECT q3.id, 'Hover over the link to see the actual URL', true FROM q3
UNION ALL
SELECT q3.id, 'Click it and see where it goes', false FROM q3
UNION ALL
SELECT q3.id, 'Check the email signature', false FROM q3
UNION ALL
SELECT q3.id, 'Ask the sender', false FROM q3;

WITH q4 AS (
  SELECT id FROM public.questions WHERE question_text = 'What is a common technique used in spear phishing?' LIMIT 1
)
INSERT INTO public.answer_options (question_id, option_text, is_correct)
SELECT q4.id, 'Using personal information to make the email seem legitimate', true FROM q4
UNION ALL
SELECT q4.id, 'Sending to random email addresses', false FROM q4
UNION ALL
SELECT q4.id, 'Using only generic greetings', false FROM q4
UNION ALL
SELECT q4.id, 'Sending from free email providers', false FROM q4;

WITH q5 AS (
  SELECT id FROM public.questions WHERE question_text = 'What does DKIM help protect against?' LIMIT 1
)
INSERT INTO public.answer_options (question_id, option_text, is_correct)
SELECT q5.id, 'Email spoofing and tampering', true FROM q5
UNION ALL
SELECT q5.id, 'Spam emails', false FROM q5
UNION ALL
SELECT q5.id, 'Large file attachments', false FROM q5
UNION ALL
SELECT q5.id, 'Slow email delivery', false FROM q5;

WITH q6 AS (
  SELECT id FROM public.questions WHERE question_text = 'You receive an email from "PayPal" asking to verify your account. What should you do?' LIMIT 1
)
INSERT INTO public.answer_options (question_id, option_text, is_correct)
SELECT q6.id, 'Go directly to PayPal.com without clicking the email link', true FROM q6
UNION ALL
SELECT q6.id, 'Click the link in the email', false FROM q6
UNION ALL
SELECT q6.id, 'Reply to the email with your information', false FROM q6
UNION ALL
SELECT q6.id, 'Call the number in the email', false FROM q6;
