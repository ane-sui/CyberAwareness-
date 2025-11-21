-- Create tips table
CREATE TABLE IF NOT EXISTS public.tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create answer options table
CREATE TABLE IF NOT EXISTS public.answer_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create user scores table
CREATE TABLE IF NOT EXISTS public.user_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage DECIMAL(5, 2) NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW()
);

-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  total_score INTEGER DEFAULT 0,
  quizzes_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answer_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Tips policies (public read)
CREATE POLICY "Allow public to view tips" ON public.tips FOR SELECT USING (true);

-- Quizzes policies (public read)
CREATE POLICY "Allow public to view quizzes" ON public.quizzes FOR SELECT USING (true);

-- Questions policies (public read)
CREATE POLICY "Allow public to view questions" ON public.questions FOR SELECT USING (true);

-- Answer options policies (public read)
CREATE POLICY "Allow public to view answer options" ON public.answer_options FOR SELECT USING (true);

-- User scores policies
CREATE POLICY "Allow users to view their own scores" ON public.user_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to insert their own scores" ON public.user_scores FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Profiles policies
CREATE POLICY "Allow users to view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow users to update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow users to insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
