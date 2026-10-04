import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, AlertCircle, Code, Server, Database, Monitor, FileCode2, Blocks } from 'lucide-react';
import axios from 'axios';

// Helper to generate 20 questions for each category
const generateQuestions = (topic) => {
  const qBank = [];
  for (let i = 1; i <= 20; i++) {
    qBank.push({
      q: `[${topic}] Question ${i}: Which of the following is a core concept of ${topic}?`,
      options: ["Option A (Incorrect)", "Option B (Correct)", "Option C (Incorrect)", "Option D (Incorrect)"],
      ans: 1
    });
  }
  return qBank;
};

const CATEGORIES = [
  { id: 'frontend', title: 'Frontend Developer', icon: Monitor, color: 'text-blue-500', bg: 'bg-blue-100', qBank: generateQuestions('Frontend Development') },
  { id: 'backend', title: 'Backend Developer', icon: Server, color: 'text-green-500', bg: 'bg-green-100', qBank: generateQuestions('Backend Development') },
  { id: 'java_fullstack', title: 'Java Full Stack Developer', icon: Code, color: 'text-orange-500', bg: 'bg-orange-100', qBank: generateQuestions('Java Full Stack') },
  { id: 'python_fullstack', title: 'Python Full Stack Developer', icon: FileCode2, color: 'text-yellow-500', bg: 'bg-yellow-100', qBank: generateQuestions('Python Full Stack') },
  { id: 'react', title: 'React Developer', icon: Blocks, color: 'text-cyan-500', bg: 'bg-cyan-100', qBank: generateQuestions('ReactJS') },
  { id: 'mern', title: 'MERN Stack Developer', icon: Database, color: 'text-purple-500', bg: 'bg-purple-100', qBank: generateQuestions('MERN Stack') },
];

const TestPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [testStarted, setTestStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [testFinished, setTestFinished] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(20).fill(null));

  useEffect(() => {
    let timer;
    if (testStarted && !testFinished && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !testFinished) {
      handleNextQuestion(null); // time out
    }
    return () => clearInterval(timer);
  }, [testStarted, testFinished, timeLeft]);

  const handleNextQuestion = async (selectedIndex) => {
    if(!selectedCategory) return;
    const currentQ = selectedCategory.qBank[currentQIndex];
    const isCorrect = selectedIndex === currentQ.ans;
    const newScore = isCorrect ? score + 1 : score;

    if (isCorrect) setScore(newScore);
    
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQIndex] = selectedIndex;
    setSelectedAnswers(newAnswers);

    if (currentQIndex < selectedCategory.qBank.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setTimeLeft(20);
    } else {
      setTestFinished(true);
      try {
        await axios.post('/api/test/submit', {
          score: newScore,
          totalQuestions: selectedCategory.qBank.length,
          testTitle: selectedCategory.title
        });
      } catch (error) {
        console.error("Failed to save test result", error);
      }
    }
  };

  const startTest = (category) => {
    setSelectedCategory(category);
    setTestStarted(true);
    setCurrentQIndex(0);
    setScore(0);
    setTimeLeft(20);
    setTestFinished(false);
    setSelectedAnswers(Array(20).fill(null));
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-4">
        <div className="card max-w-md w-full p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle className="w-8 h-8" /></div>
          <h2 className="text-2xl font-bold text-slate-900">Authentication Required</h2>
          <p className="text-slate-500">You must be logged in to take the skill assessment test.</p>
          <button onClick={() => navigate('/')} className="w-full btn-primary">Go to Home</button>
        </div>
      </div>
    );
  }

  if (testFinished) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-4">
        <div className="card max-w-lg w-full p-10 text-center space-y-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-green-100 text-green-600"><CheckCircle className="w-10 h-10" /></div>
          <h2 className="text-3xl font-bold text-slate-900">Test Completed!</h2>
          <p className="text-slate-500 text-lg">You have successfully completed the {selectedCategory?.title} Assessment.</p>
          <div className="bg-slate-100 rounded-2xl p-6 mb-6">
            <p className="text-sm text-slate-500 mb-1">Your Score</p>
            <p className="text-4xl font-black text-blue-600">{score} <span className="text-2xl text-slate-400">/ {selectedCategory?.qBank.length}</span></p>
          </div>
          <button onClick={() => navigate('/seeker-dashboard')} className="w-full btn-primary">Go to Dashboard</button>
        </div>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="bg-slate-50 min-h-[calc(100vh-80px)] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold text-slate-900">Skill Assessments</h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Select a specialized domain test to validate your technical expertise and stand out to top employers.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              return (
                <div key={cat.id} className="card p-6 flex flex-col items-center text-center hover:-translate-y-2 transition-transform cursor-pointer border-t-4 border-t-blue-500" onClick={() => startTest(cat)}>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${cat.bg} ${cat.color}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{cat.title}</h3>
                  <p className="text-slate-500 text-sm mb-6">20 Questions • 20s per Question</p>
                  <button className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl transition-colors border border-slate-200">Start Assessment</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const currentQ = selectedCategory.qBank[currentQIndex];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex flex-col py-10 px-4">
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{selectedCategory.title}</h1>
            <p className="text-slate-500 font-medium">Question {currentQIndex + 1} of {selectedCategory.qBank.length}</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-lg ${timeLeft <= 5 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
            <Clock className="w-5 h-5" />
            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </div>
        </div>

        <div className="w-full bg-slate-200 h-2 rounded-full mb-8 overflow-hidden">
          <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${((currentQIndex) / selectedCategory.qBank.length) * 100}%` }}></div>
        </div>

        <div className="card p-6 md:p-8 mb-8 flex-1">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-8">{currentQ.q}</h2>
          <div className="space-y-4">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleNextQuestion(idx)}
                className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 font-medium text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:scale-[0.99]"
              >
                <span className="inline-block w-8 h-8 rounded-lg bg-slate-100 text-slate-500 text-center leading-8 mr-3 font-bold">{String.fromCharCode(65 + idx)}</span>
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
