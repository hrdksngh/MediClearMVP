import plusSign from "./assets/PlusSign.png";
import pillsImage from "./assets/Pills.png";
import checklistImage from "./assets/Testxx.png";

import React, { useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CloudUpload,
  ClipboardList,
  HeartPulse,
  Moon,
  Pill,
  Plus,
  ShieldCheck,
  Stethoscope,
  Sun,
  Sunset,
  Trash2
} from "lucide-react";

const starterMedicines = [
  {
    id: 1,
    name: "Metformin",
    dose: "2 tablets",
    time: "Morning",
    instruction: "With breakfast",
    type: "Changed"
  },
  {
    id: 2,
    name: "Vitamin D",
    dose: "1 tablet",
    time: "Morning",
    instruction: "After breakfast",
    type: "Continue"
  },
  {
    id: 3,
    name: "Amoxicillin",
    dose: "1 capsule",
    time: "Afternoon",
    instruction: "After lunch",
    type: "New"
  },
  {
    id: 4,
    name: "Ibuprofen",
    dose: "1 capsule",
    time: "Evening",
    instruction: "After dinner",
    type: "New"
  }
];

const defaultQuestions = [
  "Should I stop my old pain medicine now?",
  "Can I take these medicines together?",
  "How long do I keep taking the antibiotic?",
  "What should I do if I miss a dose?"
];

function App() {
  const [screen, setScreen] = useState(0);

  const [account, setAccount] = useState({
    fullName: "",
    email: "",
    password: "",
    privacy: false
  });

  const [medicines, setMedicines] = useState(starterMedicines);

  const [newMedicine, setNewMedicine] = useState({
    name: "",
    dose: "",
    time: "Morning",
    instruction: "",
    type: "New"
  });

  const [uploadedFile, setUploadedFile] = useState("");
  const [manualMode, setManualMode] = useState(false);
  const [medicineInfoAdded, setMedicineInfoAdded] = useState(false);

  const [questions, setQuestions] = useState(defaultQuestions);
  const [customQuestion, setCustomQuestion] = useState("");

  const totalScreens = 6;

  const goNext = () => {
    setScreen((current) => Math.min(current + 1, totalScreens - 1));
  };

  const goBack = () => {
    setScreen((current) => Math.max(current - 1, 0));
  };

  const restart = () => {
    setScreen(0);
  };

  const handleAccountChange = (event) => {
    const { name, value, checked, type } = event.target;

    setAccount((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleMedicineChange = (event) => {
    const { name, value } = event.target;

    setNewMedicine((current) => ({
      ...current,
      [name]: value
    }));
  };

  const addMedicine = () => {
    if (!newMedicine.name.trim() || !newMedicine.dose.trim()) {
      alert("Please enter at least the medicine name and dose.");
      return;
    }

    const medicineToAdd = {
      ...newMedicine,
      id: Date.now()
    };

    setMedicines((current) => [...current, medicineToAdd]);
    setMedicineInfoAdded(true);

    setNewMedicine({
      name: "",
      dose: "",
      time: "Morning",
      instruction: "",
      type: "New"
    });
  };

  const removeMedicine = (id) => {
    setMedicines((current) => current.filter((medicine) => medicine.id !== id));
  };

  const addQuestion = () => {
    if (!customQuestion.trim()) {
      alert("Please type a question first.");
      return;
    }

    setQuestions((current) => [...current, customQuestion]);
    setCustomQuestion("");
  };

  const groupedMedicines = {
    Morning: medicines.filter((medicine) => medicine.time === "Morning"),
    Afternoon: medicines.filter((medicine) => medicine.time === "Afternoon"),
    Evening: medicines.filter((medicine) => medicine.time === "Evening")
  };

  return (
    <main className="app-shell">
      <section className="phone-frame">
        {screen > 0 && screen < 5 && (
          <button className="back-button" onClick={goBack} aria-label="Go back">
            <ChevronLeft size={22} />
          </button>
        )}

        {screen === 0 && <WelcomeScreen onNext={goNext} />}

        {screen === 1 && (
          <CreateAccountScreen
            account={account}
            onChange={handleAccountChange}
            onNext={goNext}
          />
        )}

        {screen === 2 && (
          <AddMedicinesScreen
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            manualMode={manualMode}
            setManualMode={setManualMode}
            medicineInfoAdded={medicineInfoAdded}
            setMedicineInfoAdded={setMedicineInfoAdded}
            newMedicine={newMedicine}
            onMedicineChange={handleMedicineChange}
            addMedicine={addMedicine}
            medicines={medicines}
            removeMedicine={removeMedicine}
            onNext={goNext}
          />
        )}

        {screen === 3 && (
          <TodayPlanScreen groupedMedicines={groupedMedicines} onNext={goNext} />
        )}

        {screen === 4 && (
          <HelpfulQuestionsScreen
            questions={questions}
            customQuestion={customQuestion}
            setCustomQuestion={setCustomQuestion}
            addQuestion={addQuestion}
            onNext={goNext}
          />
        )}

        {screen === 5 && <SuccessScreen onRestart={restart} />}

        <ProgressDots current={screen} total={totalScreens} />
      </section>
    </main>
  );
}

function WelcomeScreen({ onNext }) {
  return (
    <div className="screen welcome-screen">
      <div className="brand-row">
        <img src={plusSign} alt="MediClear plus sign logo" className="brand-logo-image" />
        <h1>MediClear</h1>
      </div>

      <div className="welcome-copy">
        <h2>Understand your medicines after discharge</h2>
        <p>
          A simple way to see what changed, what to take, and what to ask your
          doctor or pharmacist.
        </p>
      </div>

      <div className="welcome-image-area">
        <img
          src={pillsImage}
          alt="Medicines and pill bottles"
          className="pills-main-image"
        />

        <div className="checklist-image-wrap">
          <img
            src={checklistImage}
            alt="Medicine checklist"
            className="checklist-image"
          />
        </div>
      </div>

      <button className="primary-button bottom-action" onClick={onNext}>
        Get Started
      </button>
    </div>
  );
}

function CreateAccountScreen({ account, onChange, onNext }) {
  const canContinue =
    account.fullName.trim() &&
    account.email.trim() &&
    account.password.trim() &&
    account.privacy;

  return (
    <div className="screen create-account-screen">
      <Header title="Create Account" variant="primary" />

      <div className="form-stack account-form">
        <input
          name="fullName"
          value={account.fullName}
          onChange={onChange}
          placeholder="Full Name"
          className="text-input"
        />

        <input
          name="email"
          value={account.email}
          onChange={onChange}
          placeholder="Email"
          className="text-input"
          type="email"
        />

        <input
          name="password"
          value={account.password}
          onChange={onChange}
          placeholder="Password"
          className="text-input"
          type="password"
        />

        <label className="checkbox-row checkbox-left">
          <input
            type="checkbox"
            name="privacy"
            checked={account.privacy}
            onChange={onChange}
          />
          <span>
            I agree to the <strong>privacy policy</strong>
          </span>
        </label>
      </div>

      <button
        className="primary-button create-account-btn"
        onClick={onNext}
        disabled={!canContinue}
      >
        Create Account
      </button>

      <p className="login-note">
        Already have an account? <strong>Log In</strong>
      </p>
    </div>
  );
}

function AddMedicinesScreen({
  uploadedFile,
  setUploadedFile,
  manualMode,
  setManualMode,
  medicineInfoAdded,
  setMedicineInfoAdded,
  newMedicine,
  onMedicineChange,
  addMedicine,
  medicines,
  removeMedicine,
  onNext
}) {
  const canContinue = uploadedFile || medicineInfoAdded;

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      setUploadedFile(file.name);
      setMedicineInfoAdded(true);
    }
  };

  const handleDemoUpload = () => {
    setUploadedFile("demo-discharge-summary.pdf");
    setMedicineInfoAdded(true);
  };

  return (
    <div className="screen add-medicines-screen">
      <Header
        title="Add your Discharge Medicines"
        variant="medicine"
        rightAction={
          <button
            className={`top-next-button ${canContinue ? "active" : ""}`}
            onClick={onNext}
            disabled={!canContinue}
            aria-label="Continue to daily plan"
          >
            <ChevronRight size={24} strokeWidth={3} />
          </button>
        }
      />

      <p className="screen-intro">
        Upload your hospital medication list or enter medicines manually
      </p>

      <label className="upload-box">
        <CloudUpload size={44} />
        <span>{uploadedFile || "Tap to upload PDF or Photo"}</span>
        <input type="file" onChange={handleFileUpload} />
      </label>

      <button className="primary-button" onClick={handleDemoUpload}>
        Upload File
      </button>

      <button
        className="secondary-button"
        onClick={() => setManualMode((current) => !current)}
      >
        {manualMode ? "Hide manual entry" : "Enter manually"}
      </button>

      {manualMode && (
        <div className="manual-card">
          <h3>Add a medicine</h3>

          <input
            name="name"
            value={newMedicine.name}
            onChange={onMedicineChange}
            placeholder="Medicine name"
            className="text-input small"
          />

          <input
            name="dose"
            value={newMedicine.dose}
            onChange={onMedicineChange}
            placeholder="Dose, e.g. 1 tablet"
            className="text-input small"
          />

          <select
            name="time"
            value={newMedicine.time}
            onChange={onMedicineChange}
            className="text-input small"
          >
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
          </select>

          <input
            name="instruction"
            value={newMedicine.instruction}
            onChange={onMedicineChange}
            placeholder="Instruction, e.g. after food"
            className="text-input small"
          />

          <select
            name="type"
            value={newMedicine.type}
            onChange={onMedicineChange}
            className="text-input small"
          >
            <option>New</option>
            <option>Changed</option>
            <option>Continue</option>
            <option>Stopped</option>
          </select>

          <button className="mini-button" onClick={addMedicine}>
            <Pill size={16} />
            Add Medicine
          </button>
        </div>
      )}

      {medicineInfoAdded && (
        <div className="medicine-preview">
          {medicines.slice(0, 4).map((medicine) => (
            <div className="preview-row" key={medicine.id}>
              <span>
                <strong>{medicine.name}</strong> — {medicine.dose}
              </span>
              <button onClick={() => removeMedicine(medicine.id)}>
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="info-row">
        <ShieldCheck size={24} />
        <p>We’ll organise your medicines into a clear daily plan.</p>
      </div>

      <div className="medicine-footer-warning">
        MediClear: does not replace your Doctor or Pharmacist
      </div>
    </div>
  );
}

function TodayPlanScreen({ groupedMedicines, onNext }) {
  return (
    <div className="screen today-plan-screen">
      <Header
        title="Today’s Plan"
        subtitle="Friday, 27 March"
        variant="today"
        rightAction={
          <button
            className="top-next-button active"
            onClick={onNext}
            aria-label="Continue to helpful questions"
          >
            <ChevronRight size={24} strokeWidth={3} />
          </button>
        }
      />

      <PlanSection
        title="Morning"
        icon={<Sun size={24} />}
        className="morning"
        medicines={groupedMedicines.Morning}
      />

      <PlanSection
        title="Afternoon"
        icon={<Sunset size={24} />}
        className="afternoon"
        medicines={groupedMedicines.Afternoon}
      />

      <PlanSection
        title="Evening"
        icon={<Moon size={24} />}
        className="evening"
        medicines={groupedMedicines.Evening}
      />
    </div>
  );
}

function PlanSection({ title, icon, className, medicines }) {
  return (
    <section className="plan-section">
      <div className={`plan-heading ${className}`}>
        {icon}
        <h3>{title}</h3>
      </div>

      <div className="plan-items">
        {medicines.length === 0 ? (
          <p className="empty-note">No medicines scheduled.</p>
        ) : (
          medicines.map((medicine) => (
            <article className="plan-item" key={medicine.id}>
              <div className="pill-icon">
                <Pill size={20} />
              </div>

              <div>
                <h4>
                  {medicine.name} <span>{medicine.dose}</span>
                </h4>
                <p>{medicine.instruction || "Follow discharge instructions"}</p>
                <small>{medicine.type} medicine</small>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function HelpfulQuestionsScreen({
  questions,
  customQuestion,
  setCustomQuestion,
  addQuestion,
  onNext
}) {
  const [showQuestionBox, setShowQuestionBox] = useState(false);

  return (
    <div className="screen helpful-questions-screen">
      <Header
        title="Helpful Questions"
        variant="helpful"
        rightAction={
          <button
            className="top-next-button active"
            onClick={onNext}
            aria-label="Continue to care plan confirmation"
          >
            <ChevronRight size={24} strokeWidth={3} />
          </button>
        }
      />

      <div className="question-list">
        {questions.map((question, index) => (
          <div className="question-card" key={`${question}-${index}`}>
            {question}
          </div>
        ))}
      </div>

      {showQuestionBox && (
        <div className="custom-question-card">
          <h3>Add your own question</h3>
          <textarea
            value={customQuestion}
            onChange={(event) => setCustomQuestion(event.target.value)}
            placeholder="Example: Can I take this with my blood pressure medicine?"
          ></textarea>

          <button
            className="mini-button"
            onClick={() => {
              addQuestion();
              if (customQuestion.trim()) {
                setShowQuestionBox(false);
              }
            }}
          >
            <Plus size={16} />
              Add Question
          </button>
        </div>
      )}

      <button
        className="primary-button bottom-action"
        onClick={() => setShowQuestionBox(true)}
      >
        Questions to ask
      </button>
    </div>
  );
}

function SuccessScreen({ onRestart }) {
  return (
    <div className="screen success-screen">
      <div className="success-icon">
        <Check size={82} strokeWidth={4} />
      </div>

      <h2>Your care plan is ready!</h2>

      <p>
        Your medicines, instructions, and questions have been organised in one
        place.
      </p>

      <button className="primary-button">View Plan</button>

      <button className="outline-button" onClick={onRestart}>
        Back to home
      </button>

      <div className="footer-help">
        Need help? Contact your Pharmacist or GP
      </div>
    </div>
  );
}

function Header({ title, subtitle, variant = "default", rightAction }) {
  return (
    <header
      className={`screen-header ${
        variant === "primary" ? "primary-header" : ""
      } ${variant === "medicine" ? "medicine-header" : ""} ${
        variant === "today" ? "today-header" : ""
      } ${variant === "helpful" ? "helpful-header" : ""}`}
    >
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
      {rightAction && <div className="header-right-action">{rightAction}</div>}
    </header>
  );
}

function ProgressDots({ current, total }) {
  return (
    <div className="progress-dots" aria-label="Screen progress">
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={index === current ? "dot active" : "dot"}
        ></span>
      ))}
    </div>
  );
}

export default App;