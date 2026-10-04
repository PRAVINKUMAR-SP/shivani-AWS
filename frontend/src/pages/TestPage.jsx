import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, AlertCircle, Code, Server, Database, Monitor, FileCode2, Blocks } from 'lucide-react';
import axios from 'axios';

// Helper to generate 20 questions for each category

const CATEGORIES = [
  { id: 'frontend', title: 'Frontend Developer', icon: Monitor, color: 'text-blue-500', bg: 'bg-blue-100', qBank: [{"q": "What does CSS stand for?", "options": ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"], "ans": 0}, {"q": "Which HTML attribute specifies an alternate text for an image?", "options": ["title", "alt", "src", "href"], "ans": 1}, {"q": "What is the correct syntax for referring to an external script called 'app.js'?", "options": ["<script href='app.js'>", "<script name='app.js'>", "<script src='app.js'>", "<script file='app.js'>"], "ans": 2}, {"q": "How do you write 'Hello World' in an alert box?", "options": ["msgBox('Hello World');", "alertBox('Hello World');", "msg('Hello World');", "alert('Hello World');"], "ans": 3}, {"q": "How do you create a function in JavaScript?", "options": ["function myFunction()", "function:myFunction()", "function = myFunction()", "create myFunction()"], "ans": 0}, {"q": "How to write an IF statement in JavaScript?", "options": ["if i = 5 then", "if i == 5 then", "if (i == 5)", "if i = 5"], "ans": 2}, {"q": "Which CSS property controls the text size?", "options": ["font-style", "text-size", "font-size", "text-style"], "ans": 2}, {"q": "How do you select an element with id 'demo'?", "options": [".demo", "#demo", "demo", "*demo"], "ans": 1}, {"q": "What is the default value of the position property?", "options": ["relative", "fixed", "absolute", "static"], "ans": 3}, {"q": "Which method removes the last element from an array?", "options": ["pop()", "push()", "shift()", "unshift()"], "ans": 0}, {"q": "What does JSON stand for?", "options": ["JavaScript Object Notation", "Java Serialized Object Notation", "JavaScript Oriented Notation", "JavaScript Output Name"], "ans": 0}, {"q": "Which operator is used to assign a value to a variable?", "options": ["*", "-", "=", "x"], "ans": 2}, {"q": "How do you round the number 7.25, to the nearest integer?", "options": ["Math.rnd(7.25)", "Math.round(7.25)", "round(7.25)", "rnd(7.25)"], "ans": 1}, {"q": "Which event occurs when the user clicks on an HTML element?", "options": ["onmouseclick", "onchange", "onclick", "onmouseover"], "ans": 2}, {"q": "How do you declare a JavaScript variable?", "options": ["variable carName;", "var carName;", "v carName;", "declare carName;"], "ans": 1}, {"q": "Which HTML element defines navigation links?", "options": ["<nav>", "<navigation>", "<navigate>", "<links>"], "ans": 0}, {"q": "What is the correct CSS syntax to change the text color of all p elements to red?", "options": ["p {text-color: red;}", "p {color: red;}", "all.p {color: red;}", "p.all {color: red;}"], "ans": 1}, {"q": "How do you add a comment in CSS?", "options": ["// this is a comment", "/* this is a comment */", "<!-- this is a comment -->", "' this is a comment"], "ans": 1}, {"q": "Which JavaScript method is used to write HTML output?", "options": ["document.write()", "document.output()", "console.log()", "window.print()"], "ans": 0}, {"q": "What does the 'z-index' property in CSS do?", "options": ["Sets the zoom level", "Specifies the stack order of an element", "Changes the font weight", "Adjusts the opacity"], "ans": 1}] },
  { id: 'backend', title: 'Backend Developer', icon: Server, color: 'text-green-500', bg: 'bg-green-100', qBank: [{"q": "What does API stand for?", "options": ["Application Programming Interface", "Advanced Programming Interface", "Application Process Integration", "Automated Program Interface"], "ans": 0}, {"q": "Which HTTP method is typically used to create a new resource?", "options": ["GET", "PUT", "POST", "DELETE"], "ans": 2}, {"q": "What is the purpose of indexing in a database?", "options": ["To encrypt data", "To speed up data retrieval", "To backup data", "To format output"], "ans": 1}, {"q": "What does SQL stand for?", "options": ["Structured Query Language", "Standard Query Language", "Simple Query Language", "System Query Language"], "ans": 0}, {"q": "Which status code represents a 'Not Found' error?", "options": ["200", "404", "500", "403"], "ans": 1}, {"q": "What is a primary key in a database?", "options": ["A key used for encryption", "A unique identifier for a record", "The first column in a table", "A password for database access"], "ans": 1}, {"q": "Which of the following is a NoSQL database?", "options": ["MySQL", "PostgreSQL", "MongoDB", "Oracle"], "ans": 2}, {"q": "What is the purpose of middleware in Express.js?", "options": ["To handle database connections", "To process requests before they reach the route handler", "To serve static files only", "To write front-end code"], "ans": 1}, {"q": "What is JWT used for?", "options": ["Database querying", "Authentication and secure information exchange", "Rendering HTML", "Styling components"], "ans": 1}, {"q": "What does CRUD stand for?", "options": ["Create, Read, Update, Delete", "Copy, Run, Undo, Drop", "Create, Run, Update, Drop", "Copy, Read, Undo, Delete"], "ans": 0}, {"q": "Which tool is commonly used to test APIs?", "options": ["Photoshop", "Postman", "Excel", "Word"], "ans": 1}, {"q": "In REST architecture, what does stateless mean?", "options": ["The server stores client state", "Each request contains all necessary information", "The client has no state", "The database is not used"], "ans": 1}, {"q": "What is a foreign key?", "options": ["A key from another country", "A field that links two tables together", "A unique identifier for a row", "An encryption key"], "ans": 1}, {"q": "What is Node.js?", "options": ["A front-end framework", "A JavaScript runtime built on Chrome's V8 engine", "A relational database", "A CSS preprocessor"], "ans": 1}, {"q": "What does CORS stand for?", "options": ["Cross-Origin Resource Sharing", "Centralized Object Routing System", "Computer Operated Resource Server", "Cross-Origin Routing System"], "ans": 0}, {"q": "Which command initializes a new Node.js project?", "options": ["npm start", "npm init", "node start", "npm create"], "ans": 1}, {"q": "What is the main role of a reverse proxy like Nginx?", "options": ["To compile code", "To distribute client requests to backend servers", "To design user interfaces", "To store passwords"], "ans": 1}, {"q": "What is ORM?", "options": ["Object Relational Mapping", "Online Resource Management", "Object Routing Mechanism", "Operational Risk Management"], "ans": 0}, {"q": "Which of the following is an example of an ORM for Node.js?", "options": ["Mongoose", "React", "Express", "Axios"], "ans": 0}, {"q": "What is a memory leak?", "options": ["When a database loses data", "When a program fails to release discarded memory", "When a server crashes", "When an API returns too much data"], "ans": 1}] },
  { id: 'java_fullstack', title: 'Java Full Stack Developer', icon: Code, color: 'text-orange-500', bg: 'bg-orange-100', qBank: [{"q": "What is the size of an int variable in Java?", "options": ["8 bit", "16 bit", "32 bit", "64 bit"], "ans": 2}, {"q": "Which concept allows a class to inherit properties from another class?", "options": ["Encapsulation", "Polymorphism", "Inheritance", "Abstraction"], "ans": 2}, {"q": "What is the default value of a boolean variable in Java?", "options": ["true", "false", "null", "0"], "ans": 1}, {"q": "Which keyword is used to prevent a variable from being modified?", "options": ["static", "final", "const", "private"], "ans": 1}, {"q": "What is the main purpose of the Spring framework?", "options": ["Frontend development", "Database management", "Enterprise Java application development", "Mobile app development"], "ans": 2}, {"q": "Which annotation is used to map web requests in Spring MVC?", "options": ["@RequestMapping", "@Controller", "@Service", "@Autowired"], "ans": 0}, {"q": "What does dependency injection achieve?", "options": ["Tight coupling", "Loose coupling", "Faster execution", "More memory usage"], "ans": 1}, {"q": "In Java, what is a Thread?", "options": ["A string of characters", "An independent path of execution", "A type of exception", "A database connection"], "ans": 1}, {"q": "Which interface does java.util.ArrayList implement?", "options": ["Set", "Map", "List", "Queue"], "ans": 2}, {"q": "What is the JPA?", "options": ["Java Programming API", "Java Persistence API", "Java Parser Architecture", "Java Platform Application"], "ans": 1}, {"q": "Which Spring annotation injects a dependency?", "options": ["@Inject", "@Resource", "@Autowired", "All of the above"], "ans": 3}, {"q": "What does the 'static' keyword mean?", "options": ["Belongs to the instance", "Belongs to the class", "Cannot be changed", "Is hidden"], "ans": 1}, {"q": "What is Hibernate?", "options": ["A web server", "An ORM tool", "A frontend framework", "A build tool"], "ans": 1}, {"q": "Which method is the entry point of a Java program?", "options": ["start()", "init()", "main()", "run()"], "ans": 2}, {"q": "What is a NullPointerException?", "options": ["A syntax error", "Accessing a method on a null object reference", "Dividing by zero", "File not found"], "ans": 1}, {"q": "Which collection does not allow duplicate elements?", "options": ["List", "Set", "Map", "Queue"], "ans": 1}, {"q": "In Spring Boot, which annotation marks the main class?", "options": ["@SpringBootApplication", "@EnableAutoConfiguration", "@Configuration", "@ComponentScan"], "ans": 0}, {"q": "What is Maven?", "options": ["A programming language", "A dependency management and build tool", "An application server", "A database"], "ans": 1}, {"q": "How do you handle exceptions in Java?", "options": ["if-else", "try-catch", "switch-case", "for-loop"], "ans": 1}, {"q": "Which design pattern restricts instantiation of a class to a single object?", "options": ["Factory", "Observer", "Singleton", "Decorator"], "ans": 2}] },
  { id: 'python_fullstack', title: 'Python Full Stack Developer', icon: FileCode2, color: 'text-yellow-500', bg: 'bg-yellow-100', qBank: [{"q": "Which keyword is used to define a function in Python?", "options": ["func", "def", "function", "lambda"], "ans": 1}, {"q": "What data type is the result of: 3 / 2 in Python 3?", "options": ["int", "float", "string", "double"], "ans": 1}, {"q": "Which framework is widely used for building web applications in Python?", "options": ["Spring", "Django", "Laravel", "Express"], "ans": 1}, {"q": "How do you insert comments in Python?", "options": ["// comment", "/* comment */", "# comment", "<!-- comment -->"], "ans": 2}, {"q": "What is a Python decorator?", "options": ["A syntax to style code", "A function that modifies another function", "A class attribute", "A variable type"], "ans": 1}, {"q": "Which data structure is immutable in Python?", "options": ["List", "Dictionary", "Tuple", "Set"], "ans": 2}, {"q": "What does the 'self' keyword represent in a class?", "options": ["The parent class", "The current instance of the class", "A static method", "A global variable"], "ans": 1}, {"q": "What is PIP?", "options": ["Python Installation Program", "Package Installer for Python", "Python Integrated Platform", "Package Integration Process"], "ans": 1}, {"q": "Which method is used to add an item to the end of a list?", "options": ["add()", "insert()", "append()", "push()"], "ans": 2}, {"q": "What is a virtual environment in Python?", "options": ["A cloud server", "An isolated workspace for project dependencies", "A text editor", "A testing framework"], "ans": 1}, {"q": "Which library is popular for data analysis in Python?", "options": ["Requests", "Pandas", "Flask", "Pygame"], "ans": 1}, {"q": "How do you open a file for reading in Python?", "options": ["open('file.txt', 'w')", "open('file.txt', 'r')", "read('file.txt')", "file.open('file.txt')"], "ans": 1}, {"q": "What is the purpose of the '__init__' method?", "options": ["To end a program", "To initialize class attributes", "To import modules", "To handle exceptions"], "ans": 1}, {"q": "What does 'yield' do in a function?", "options": ["Stops execution completely", "Returns a generator object", "Throws an error", "Imports a library"], "ans": 1}, {"q": "Which ORM is commonly used with Django?", "options": ["SQLAlchemy", "Django ORM", "Hibernate", "Sequelize"], "ans": 1}, {"q": "How do you handle exceptions in Python?", "options": ["try/except", "try/catch", "do/while", "if/else"], "ans": 0}, {"q": "What is FastAPI?", "options": ["A database", "A modern, fast web framework for Python", "A frontend library", "A machine learning model"], "ans": 1}, {"q": "What is the output of 'print(type([]))'?", "options": ["<class 'list'>", "<class 'array'>", "<class 'tuple'>", "<class 'dict'>"], "ans": 0}, {"q": "How do you create a dictionary in Python?", "options": ["[]", "()", "{}", "<>"], "ans": 2}, {"q": "What does the 'pass' statement do?", "options": ["Exits a loop", "Does nothing, used as a placeholder", "Skips to the next iteration", "Returns a value"], "ans": 1}] },
  { id: 'react', title: 'React Developer', icon: Blocks, color: 'text-cyan-500', bg: 'bg-cyan-100', qBank: [{"q": "What is React?", "options": ["A database", "A JavaScript library for building user interfaces", "A CSS framework", "A backend language"], "ans": 1}, {"q": "What is JSX?", "options": ["Java Syntax Extension", "JavaScript XML", "JSON XML", "JavaScript Syntax"], "ans": 1}, {"q": "Which hook is used to manage state in a functional component?", "options": ["useEffect", "useContext", "useState", "useReducer"], "ans": 2}, {"q": "What is the Virtual DOM?", "options": ["A direct copy of the real DOM", "A lightweight representation of the real DOM", "A browser extension", "A database structure"], "ans": 1}, {"q": "Which hook is used to perform side effects?", "options": ["useState", "useEffect", "useMemo", "useCallback"], "ans": 1}, {"q": "What are props in React?", "options": ["Internal state", "Arguments passed into React components", "HTML tags", "CSS styles"], "ans": 1}, {"q": "How do you pass data from a child to a parent component?", "options": ["Using props", "Using a callback function passed as a prop", "Using context", "It is not possible"], "ans": 1}, {"q": "What is the purpose of the 'key' prop when rendering a list?", "options": ["To style the item", "To help React identify which items changed", "To act as an ID for CSS", "To sort the list"], "ans": 1}, {"q": "What does 'useMemo' do?", "options": ["Memoizes a function", "Memoizes a computed value", "Manages state", "Fetches data"], "ans": 1}, {"q": "Which library is commonly used for routing in React?", "options": ["React Router", "Redux", "Axios", "Bootstrap"], "ans": 0}, {"q": "What is Redux?", "options": ["A UI library", "A state management library", "A database", "A testing framework"], "ans": 1}, {"q": "In React, component names must start with:", "options": ["A lowercase letter", "An uppercase letter", "A number", "An underscore"], "ans": 1}, {"q": "What is a Higher-Order Component (HOC)?", "options": ["A component that renders other components", "A function that takes a component and returns a new component", "A component connected to Redux", "A built-in React component"], "ans": 1}, {"q": "Which method is used to render a React element into the DOM?", "options": ["React.mount()", "ReactDOM.render()", "React.render()", "DOM.render()"], "ans": 1}, {"q": "What is Context API used for?", "options": ["Styling components", "Sharing state across the entire app without passing props manually", "Fetching data from APIs", "Routing"], "ans": 1}, {"q": "What does 'useCallback' return?", "options": ["A memoized value", "A memoized callback function", "A state variable", "A ref object"], "ans": 1}, {"q": "How can you prevent a component from re-rendering?", "options": ["Using React.memo", "Using useState", "Using useEffect", "Returning null"], "ans": 0}, {"q": "What is a ref in React?", "options": ["A reference to a database", "A way to access DOM nodes directly", "A routing method", "A state variable"], "ans": 1}, {"q": "Which lifecycle method is equivalent to useEffect with an empty dependency array?", "options": ["componentDidUpdate", "componentWillUnmount", "componentDidMount", "render"], "ans": 2}, {"q": "What is React StrictMode?", "options": ["A tool for highlighting potential problems in an application", "A strict typing system like TypeScript", "A security feature", "A production optimizer"], "ans": 0}] },
  { id: 'mern', title: 'MERN Stack Developer', icon: Database, color: 'text-purple-500', bg: 'bg-purple-100', qBank: [{"q": "What does MERN stand for?", "options": ["MySQL, Express, React, Node", "MongoDB, Express, React, Node", "MongoDB, Ember, React, Node", "MariaDB, Express, React, Node"], "ans": 1}, {"q": "Which database is used in the MERN stack?", "options": ["PostgreSQL", "MongoDB", "MySQL", "Oracle"], "ans": 1}, {"q": "What type of database is MongoDB?", "options": ["Relational", "NoSQL Document-oriented", "Graph", "Key-Value"], "ans": 1}, {"q": "In a MERN app, which technology acts as the web server?", "options": ["React", "MongoDB", "Node.js (with Express)", "Apache"], "ans": 2}, {"q": "Which ODM (Object Data Modeling) library is commonly used with MongoDB in Node?", "options": ["Sequelize", "TypeORM", "Mongoose", "Hibernate"], "ans": 2}, {"q": "How do you connect React frontend to Node backend?", "options": ["Using HTTP requests (e.g., fetch, axios)", "Using MongoDB directly", "Using HTML links", "Using Redux"], "ans": 0}, {"q": "What format does MongoDB use to store data?", "options": ["XML", "CSV", "BSON (Binary JSON)", "Plain text"], "ans": 2}, {"q": "What is Express.js?", "options": ["A frontend framework", "A minimalist web framework for Node.js", "A database engine", "A testing tool"], "ans": 1}, {"q": "How do you start a Node.js server typically?", "options": ["node server.js", "npm build", "react-scripts start", "mongod"], "ans": 0}, {"q": "What is the purpose of a .env file in a MERN app?", "options": ["To store CSS styles", "To store environment variables and secrets", "To configure MongoDB schemas", "To manage routing"], "ans": 1}, {"q": "Which command installs Express in a Node project?", "options": ["npm install express", "install express", "npm add express", "node install express"], "ans": 0}, {"q": "What does 'req.body' contain in an Express route?", "options": ["The URL parameters", "The HTTP headers", "Data sent in the request body", "The response data"], "ans": 2}, {"q": "To parse JSON bodies in Express, which middleware is used?", "options": ["express.json()", "express.parse()", "body.parser()", "json.parse()"], "ans": 0}, {"q": "What is the primary role of React in MERN?", "options": ["Database management", "Server-side logic", "Building the user interface (Client-side)", "API routing"], "ans": 2}, {"q": "Which HTTP method is used to update data in a REST API?", "options": ["GET", "POST", "PUT/PATCH", "DELETE"], "ans": 2}, {"q": "How can you avoid CORS errors during development?", "options": ["Disable security in browser", "Use the 'cors' middleware in Express", "Use MySQL instead", "Don't use APIs"], "ans": 1}, {"q": "What does a Mongoose Schema define?", "options": ["The UI layout", "The structure of the document in a MongoDB collection", "The API endpoints", "The server configuration"], "ans": 1}, {"q": "How do you fetch all documents from a Mongoose model named 'User'?", "options": ["User.getAll()", "User.find()", "User.fetch()", "User.select()"], "ans": 1}, {"q": "What tool is often used for running a React dev server?", "options": ["Nodemon", "Vite or Create React App", "Mongoose", "PM2"], "ans": 1}, {"q": "What is Nodemon used for?", "options": ["To format code", "To automatically restart the Node server when files change", "To deploy the app", "To monitor database performance"], "ans": 1}] },
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
