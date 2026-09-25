import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const questions = [
  // HTML
  { q: "What does HTML stand for?", options: ["Hyper Text Preprocessor", "Hyper Text Markup Language", "Hyper Tool Multi Language", "Hyperlink Text Markup Language"], ans: 1 },
  { q: "Choose the correct HTML element for the largest heading:", options: ["<heading>", "<h6>", "<h1>", "<head>"], ans: 2 },
  { q: "What is the correct HTML element for inserting a line break?", options: ["<break>", "<br>", "<lb>", "<brk>"], ans: 1 },
  { q: "Which character is used to indicate an end tag?", options: ["*", "^", "<", "/"], ans: 3 },
  { q: "How can you make a numbered list?", options: ["<ul>", "<dl>", "<list>", "<ol>"], ans: 3 },
  // CSS
  { q: "What does CSS stand for?", options: ["Computer Style Sheets", "Colorful Style Sheets", "Cascading Style Sheets", "Creative Style Sheets"], ans: 2 },
  { q: "Where in an HTML document is the correct place to refer to an external style sheet?", options: ["At the end of the document", "In the <body> section", "In the <head> section", "In the <title> section"], ans: 2 },
  { q: "Which HTML tag is used to define an internal style sheet?", options: ["<script>", "<style>", "<css>", "<link>"], ans: 1 },
  { q: "Which property is used to change the background color?", options: ["color", "bgcolor", "background-color", "bg-color"], ans: 2 },
  { q: "Which CSS property controls the text size?", options: ["font-style", "text-size", "font-size", "text-style"], ans: 2 },
  // JS
  { q: "Inside which HTML element do we put the JavaScript?", options: ["<javascript>", "<js>", "<scripting>", "<script>"], ans: 3 },
  { q: "How do you write 'Hello World' in an alert box?", options: ["msg('Hello World');", "alertBox('Hello World');", "msgBox('Hello World');", "alert('Hello World');"], ans: 3 },
  { q: "How do you create a function in JavaScript?", options: ["function myFunction()", "function:myFunction()", "function = myFunction()", "create myFunction()"], ans: 0 },
  { q: "How to write an IF statement in JavaScript?", options: ["if i = 5 then", "if i == 5 then", "if (i == 5)", "if i = 5"], ans: 2 },
  { q: "How does a FOR loop start?", options: ["for i = 1 to 5", "for (i <= 5; i++)", "for (i = 0; i <= 5; i++)", "for (i = 0; i <= 5)"], ans: 2 },
  // Java
  { q: "What is a correct syntax to output 'Hello World' in Java?", options: ["echo('Hello World');", "System.out.println('Hello World');", "print ('Hello World');", "Console.WriteLine('Hello World');"], ans: 1 },
  { q: "Java is short for 'JavaScript'.", options: ["True", "False"], ans: 1 },
  { q: "How do you insert COMMENTS in Java code?", options: ["# This is a comment", "/* This is a comment", "// This is a comment", "<!-- This is a comment -->"], ans: 2 },
  { q: "Which data type is used to create a variable that should store text?", options: ["myString", "string", "String", "Txt"], ans: 2 },
  { q: "How do you create a variable with the numeric value 5 in Java?", options: ["num x = 5", "float x = 5;", "x = 5;", "int x = 5;"], ans: 3 },
];

const TestPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
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
    // Record answer and update score if correct
    const currentQ = questions[currentQIndex];
    const isCorrect = selectedIndex === currentQ.ans;
    const newScore = isCorrect ? score + 1 : score;

    if (isCorrect) {
      setScore(newScore);
    }
    
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQIndex] = selectedIndex;
    setSelectedAnswers(newAnswers);

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setTimeLeft(20); // reset timer for next question
    } else {
      setTestFinished(true);
      // Submit result to backend
      try {
        // We set up axios interceptor in AuthContext to include token, so this should work automatically
        await axios.post('/api/test/submit', {
          score: newScore,
          totalQuestions: questions.length
        });
      } catch (error) {
        console.error("Failed to save test result", error);
      }
    }
  };

  const startTest = () => {
    setTestStarted(true);
    setCurrentQIndex(0);
    setScore(0);
    setTimeLeft(20);
    setTestFinished(false);
    setSelectedAnswers(Array(20).fill(null));
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center p-4">
        <div className="card max-w-md w-full p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Authentication Required</h2>
          <p className="text-slate-500 dark:text-slate-400">You must be logged in to take the skill assessment test. Please log in first to continue.</p>
          <button 
            onClick={() => navigate('/')} 
            className="w-full btn-primary"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (testFinished) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center p-4">
        <div className="card max-w-lg w-full p-10 text-center space-y-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-green-100 text-green-600">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Test Completed!</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Thank you for taking the skill assessment.</p>
          
          <div className="py-4 border-y border-slate-100 dark:border-slate-700 my-6">
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium mt-1">
              Your results have been successfully submitted to the admin team for review.
            </p>
          </div>
          
          <div className="flex gap-4">
            <button onClick={() => navigate('/services')} className="flex-1 btn-primary">Back to Services</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-[#0f172a] py-12 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        {!testStarted ? (
          <div className="card p-10 text-center space-y-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Skill Assessment Test</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-xl mx-auto">
              This test consists of 20 multiple-choice questions covering HTML, CSS, JavaScript, and Java. 
              You have exactly 20 seconds to answer each question.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto my-8">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl text-blue-700 dark:text-blue-400 font-bold">20 Questions</div>
              <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-xl text-purple-700 dark:text-purple-400 font-bold">20s per Question</div>
            </div>
            <button onClick={startTest} className="btn-primary w-full sm:w-auto px-12 text-lg">
              Start Test Now
            </button>
          </div>
        ) : (
          <div className="card p-8 sm:p-12">
            <div className="flex justify-between items-end mb-8 border-b border-slate-100 dark:border-slate-700 pb-6">
              <div>
                <span className="text-sm font-bold tracking-wider text-blue-600 uppercase">Question {currentQIndex + 1} of {questions.length}</span>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 w-48">
                  <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}></div>
                </div>
              </div>
              <div className={`flex items-center gap-2 font-bold text-lg px-4 py-2 rounded-lg ${timeLeft <= 5 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                <Clock className="w-5 h-5" />
                00:{timeLeft.toString().padStart(2, '0')}
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 leading-snug">
              {questions[currentQIndex].q}
            </h2>
            
            <div className="space-y-4">
              {questions[currentQIndex].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNextQuestion(idx)}
                  className="w-full text-left p-5 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-200 font-medium transition-all group flex items-center"
                >
                  <span className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center mr-4 group-hover:border-blue-500 group-hover:text-blue-600 transition-colors">
                    {['A', 'B', 'C', 'D'][idx]}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;

