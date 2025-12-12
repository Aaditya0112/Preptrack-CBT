import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EXAMS from '../data/examsList';
import QuestionRenderer from '../components/QuestionRenderer';

function QuestionCard({ q, idx, checked, onToggle }) {
  return (
    <div className="p-5 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-gray-800">Q{idx + 1}</h4>
        </div>
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={checked} onChange={() => onToggle(q.id)} className="hidden peer" />
            <div className="w-5 h-5 rounded border flex items-center justify-center peer-checked:bg-blue-600 peer-checked:border-blue-600 text-white">{checked ? '✓' : ''}</div>
          </label>
        </div>
      </div>
      <div className="mt-3 text-sm text-gray-700">
        <QuestionRenderer text={q.questionText} />
        {q.image && <img src={q.image} alt="q-img" className="mt-3 max-w-full rounded shadow-sm" />}
      </div>
      <div className="mt-4">
        {q.type === 'MCQ' && (
          <div className="grid grid-cols-1 gap-2">
            {q.options.map((opt) => (
              <div key={opt.id} className="flex items-center gap-3 p-3 rounded-lg bg-white ">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold">{opt.id}</div>
                <div className="flex-1 text-sm text-gray-800"><QuestionRenderer text={opt.text} inline={true} /></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Preview() {
  const location = useLocation();
  const navigate = useNavigate();
  // allow passing a full exam object in location.state (topic-level exams) for frontend working purpose only
  const stateExam = location?.state?.exam;
  
  ////


  const examId = location?.state?.examId || new URLSearchParams(location.search).get('examId');
  const examEntry = EXAMS.find((e) => e.id === examId);
  const examFromList = examEntry?.exam;
  const exam = stateExam || examFromList;

  const questions = exam?.questions || [];
  const [selected, setSelected] = useState(() => new Set(questions.map((q) => q.id)) );
  const [timed, setTimed] = useState(true);
  const [timeMinutes, setTimeMinutes] = useState(() => exam?.durationInSeconds ? Math.round(exam.durationInSeconds / 60) : 180);
  const [rangeText, setRangeText] = useState('');
  const [selectionMode, setSelectionMode] = useState('all'); // 'all' or 'customized'
  // section selection state: start with all sections selected.
  // If `exam.sections` is missing, derive sections from questions; if no section info exists, use a sentinel '__all__'.
  const [selectedSections, setSelectedSections] = useState(() => {
    const fromExam = (exam?.sections || []).map(s => s.id);
    if (fromExam.length > 0) return new Set(fromExam);
    const fromQuestions = Array.from(new Set(questions.map(q => q.sectionId).filter(Boolean)));
    if (fromQuestions.length > 0) return new Set(fromQuestions);
    return new Set(['__all__']);
  });
  // availableSections: either from exam metadata or derived from questions
  const availableSections = React.useMemo(() => {
    if (exam?.sections && exam.sections.length > 0) return exam.sections;
    const ids = Array.from(new Set(questions.map(q => q.sectionId).filter(Boolean)));
    if (ids.length === 0) return [];
    return ids.map((id, idx) => ({ id, name: `Section ${idx + 1}` }));
  }, [exam, questions]);

  // helper: how many available sections are currently selected
  const selectedSectionCount = React.useMemo(() => {
    if (!availableSections || availableSections.length === 0) return 0;
    return availableSections.filter(s => selectedSections.has(s.id)).length;
  }, [availableSections, selectedSections]);

  // recompute filtered questions when selectedSections or full questions list changes
  const filteredQuestions = React.useMemo(() => {
    // If we have explicit available sections and none are selected, return empty (user must pick a section)
    if (availableSections && availableSections.length > 0) {
      if (!selectedSections || selectedSections.size === 0) return [];
      return questions.filter(q => selectedSections.has(q.sectionId));
    }
    // No section metadata available -> return all questions
    return questions.slice();
  }, [questions, selectedSections]);

  // auto-parse rangeText and update `selected` automatically (works on filteredQuestions)
  React.useEffect(() => {
    const text = (rangeText || '').trim();
    if (text === '') {
      // empty input -> keep all selected (unless customized mode)
      // Only auto-select if there are visible questions
      if (selectionMode === 'all' && filteredQuestions.length > 0) {
        setSelected(new Set(filteredQuestions.map((q) => q.id)));
      }
      return;
    }

    const parts = text.split(',').map(p => p.trim()).filter(Boolean);
    const ids = new Set();
    for (const p of parts) {
      if (/^\d+-\d+$/.test(p)) {
        const [a, b] = p.split('-').map(n => parseInt(n, 10));
        if (Number.isFinite(a) && Number.isFinite(b)) {
          const from = Math.max(1, Math.min(a, b));
          const to = Math.min(filteredQuestions.length, Math.max(a, b));
          for (let i = from; i <= to; i++) ids.add(filteredQuestions[i - 1].id);
        }
      } else if (/^\d+$/.test(p)) {
        const n = parseInt(p, 10);
        if (n >= 1 && n <= filteredQuestions.length) ids.add(filteredQuestions[n - 1].id);
      }
    }
    if (ids.size > 0) setSelected(ids);
  }, [rangeText, filteredQuestions]);

  // ensure selected set only contains ids from filteredQuestions when sections change
  React.useEffect(() => {
    setSelected(prev => {
      const allowed = new Set(filteredQuestions.map(q => q.id));
      const next = new Set();
      for (const id of prev) if (allowed.has(id)) next.add(id);
      // if nothing remains selected, default to selecting all filtered questions only if there are visible questions
      if (next.size === 0 && filteredQuestions.length > 0) filteredQuestions.forEach(q => next.add(q.id));
      return next;
    });
  }, [filteredQuestions]);

  const toggle = (id) => {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const selectAll = () => setSelected(new Set(filteredQuestions.map((q) => q.id)));
  const clearAll = () => setSelected(new Set());

  const toggleSection = (sectionId) => {
    setSelectedSections(prev => {
      const n = new Set(prev);
      if (n.has(sectionId)) n.delete(sectionId); else n.add(sectionId);
      return n;
    });
  };

  const selectRange = () => {
    const from = Math.max(1, parseInt(rangeFrom || '1', 10));
    const to = Math.min(questions.length, parseInt(rangeTo || String(questions.length), 10));
    if (isNaN(from) || isNaN(to) || from > to) return;
    setSelected((s) => {
      const n = new Set(s);
      for (let i = from; i <= to; i++) n.add(questions[i - 1].id);
      return n;
    });
  };

  const handleProceed = () => {
    if (!exam) return;
    if (!selected || selected.size === 0) {
      alert('Please select at least one question');
      return;
    }
  const selectedQs = questions.filter((q) => selected.has(q.id));
    // pass only the selected sections metadata as well
  const selectedSectionObjs = availableSections.filter(s => selectedSections.has(s.id));
  const examForRun = { ...exam, questions: selectedQs, sections: selectedSectionObjs, durationInSeconds: timed ? timeMinutes * 60 : 0 };
    // navigate to assessment with exam object in state
    navigate('/assessment', { state: { exam: examForRun } });
  };

  if (!exam) {
    return (
      <div className="p-8">
        <h2 className="text-xl">Exam not found</h2>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 flex flex-col">
      <div className="max-w-7xl mx-auto flex-1 flex flex-col">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{exam.examTitle || 'Preview Exam'}</h1>
            <p className="text-sm text-gray-500 mt-1">Preview questions and select a subset to run. Duration: {exam.durationInSeconds ? `${Math.floor(exam.durationInSeconds/60)} min` : 'Untimed'}</p>
          </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">Questions shown</div>
              <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">{filteredQuestions.length}</div>
            </div>
        </header>

        <div className="flex-1 grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-lg shadow divide-y overflow-auto flex items-center justify-center" style={{ maxHeight: '100%' }}>
            {filteredQuestions.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-red-600 font-semibold mb-2">No Section(s) Selected to Proceed</div>
                <div className="text-sm text-gray-600">Select one or more sections from the right to preview questions and enable selection.</div>
              </div>
            ) : (
              <div className="w-full">
                {filteredQuestions.map((q, idx) => (
                  <QuestionCard key={q.id} q={q} idx={idx} checked={selected.has(q.id)} onToggle={toggle} />
                ))}
              </div>
            )}
          </div>

          <aside className="col-span-1 sticky top-6 bg-white rounded-lg shadow p-5 h-fit">
            <h3 className="font-semibold mb-3 text-gray-800">Selection</h3>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">Sections</label>
              <div className="space-y-2">
                {availableSections.map(sec => (
                  <label key={sec.id} className="flex items-center gap-2">
                    <input type="checkbox" checked={selectedSections.has(sec.id)} onChange={() => toggleSection(sec.id)} />
                    <span className="text-sm text-gray-700">{sec.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">Questions to include</label>
              <div className="flex items-center gap-3">
                <select value={selectionMode} onChange={(e) => {
                    const val = e.target.value;
                    setSelectionMode(val);
                    if (val === 'all' && filteredQuestions.length > 0) { setRangeText(''); selectAll(); }
                  }} className="border p-2 rounded w-28" disabled={filteredQuestions.length === 0}>
                  <option value="all">All</option>
                  <option value="customized">Customized</option>
                </select>
                <div className="text-sm text-gray-500">(Choose which questions to include)</div>
              </div>

              {selectionMode === 'customized' && (
                <div className="mt-3">
                  <label className="block text-sm text-gray-600">Enter numbers or ranges (e.g. 1,2,5-8)</label>
                  <div className="mt-2">
                    <input
                      value={rangeText}
                      onChange={(e) => {
                        // allow only digits, commas, hyphens and spaces
                        const raw = e.target.value;
                        const sanitized = raw.replace(/[^0-9,\-\s]/g, '');
                        setRangeText(sanitized);
                      }}
                      className="w-full border p-2 rounded"
                      placeholder={`1,2,5-${filteredQuestions.length || questions.length}`}
                      disabled={filteredQuestions.length === 0}
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-500">Allowed: digits, comma, hyphen. Examples: 1,3,5-8</div>
                </div>
              )}

              {filteredQuestions.length === 0 && (
                <div className="mt-3 text-sm text-red-600">Please select at least one section to enable question selection.</div>
              )}
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div className="text-sm">Timed exam</div>
                <button
                  onClick={() => setTimed(!timed)}
                  aria-pressed={timed}
                  className={`w-14 h-8 flex items-center p-1 rounded-full transition-colors ${timed ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                  <div className={`bg-white w-6 h-6 rounded-full shadow transform transition-transform ${timed ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">If untimed, assessment runs without countdown.</p>
            </div>

            {timed && (
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">Set duration (minutes)</label>
                <input
                  type="number"
                  min={1}
                  value={timeMinutes}
                  onChange={(e) => setTimeMinutes(Math.max(1, parseInt(e.target.value || '1', 10)))}
                  className="w-full border p-2 rounded"
                />
                <div className="text-xs text-gray-500 mt-1">Default: 180 minutes</div>
              </div>
            )}

            <div className="mt-6">
              <button onClick={handleProceed} className={`w-full py-2 text-white rounded shadow ${filteredQuestions.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600'}`} disabled={filteredQuestions.length === 0}>Proceed to Assessment</button>
              <button onClick={() => navigate('/dashboard')} className="w-full mt-3 py-2 bg-white text-gray-700 rounded border">Back to Dashboard</button>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <div>Selected: <span className="font-medium text-gray-800">{selected.size}</span> / {filteredQuestions.length}</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
