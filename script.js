const form = document.getElementById('workout-form');
const result = document.getElementById('result');

const exerciseBank = {
  home: {
    squat: ['Bodyweight Squat', 'Split Squat', 'Tempo Squat'],
    hinge: ['Glute Bridge', 'Single-Leg Hip Hinge', 'Hip Thrust'],
    push: ['Knee Push-Up', 'Push-Up', 'Pike Push-Up'],
    pull: ['Doorway Row (towel)', 'Prone Y-T-W Raises', 'Back Widow'],
    core: ['Dead Bug', 'Plank', 'Side Plank']
  },
  dumbbells: {
    squat: ['Goblet Squat', 'Dumbbell Split Squat', 'Dumbbell Step-Up'],
    hinge: ['Dumbbell Romanian Deadlift', 'Dumbbell Hip Thrust', 'Dumbbell Good Morning'],
    push: ['Dumbbell Floor Press', 'Dumbbell Overhead Press', 'Incline Push-Up'],
    pull: ['One-Arm Dumbbell Row', 'Chest-Supported DB Row', 'Reverse Fly'],
    core: ['Dead Bug', 'Plank with DB Drag', 'Suitcase Carry']
  },
  'full gym': {
    squat: ['Back Squat', 'Leg Press', 'Walking Lunge'],
    hinge: ['Romanian Deadlift', 'Cable Pull-Through', 'Hip Thrust'],
    push: ['Bench Press', 'Seated DB Shoulder Press', 'Machine Chest Press'],
    pull: ['Lat Pulldown', 'Seated Cable Row', 'Assisted Pull-Up'],
    core: ['Cable Pallof Press', 'Plank', 'Hanging Knee Raise']
  }
};

function pick(list, index) {
  return list[index % list.length];
}

function getPrescription(goal, experience) {
  const isBeginner = experience === 'beginner';
  const baseSets = isBeginner ? '2-3 sets' : '3-4 sets';
  const baseReps = goal === 'strength' ? '8-10 reps' : '10-12 reps';
  return { baseSets, baseReps, isBeginner };
}

function buildWorkout(dayIndex, equipment, goal, experience) {
  const bank = exerciseBank[equipment];
  const { baseSets, baseReps, isBeginner } = getPrescription(goal, experience);
  const exercises = [
    { pattern: 'Squat', name: pick(bank.squat, dayIndex) },
    { pattern: 'Hinge', name: pick(bank.hinge, dayIndex + 1) },
    { pattern: 'Push', name: pick(bank.push, dayIndex + 2) },
    { pattern: 'Pull', name: pick(bank.pull, dayIndex + 3) },
    { pattern: 'Core', name: pick(bank.core, dayIndex + 4) }
  ];

  const conditioning =
    goal === 'weight loss'
      ? {
          name: 'Brisk walk / bike / easy circuit finisher',
          details: '10-15 minutes moderate pace'
        }
      : null;

  const notes = isBeginner
    ? 'Rest 60-90 sec between sets. Keep 1-2 reps in reserve.'
    : 'Rest 60-120 sec between sets. Add load gradually week to week.';

  return { exercises, baseSets, baseReps, conditioning, notes };
}

function generateWeek(daysPerWeek, equipment, goal, experience) {
  const week = [];
  let workoutDayCount = 0;

  for (let i = 1; i <= 7; i += 1) {
    if (workoutDayCount < daysPerWeek && (i % 2 === 1 || 7 - i < daysPerWeek - workoutDayCount)) {
      week.push({ type: 'workout', dayLabel: `Day ${workoutDayCount + 1}`, data: buildWorkout(workoutDayCount, equipment, goal, experience) });
      workoutDayCount += 1;
    } else {
      week.push({ type: 'rest', dayLabel: `Rest Day ${i}` });
    }
  }

  return week;
}

function renderPlan(input, weekPlan) {
  const dayCards = weekPlan
    .map((day) => {
      if (day.type === 'rest') {
        return `
          <article class="day-card">
            <h3>${day.dayLabel}</h3>
            <p class="rest">Recovery, light walking, and mobility (10-20 min).</p>
          </article>
        `;
      }

      const exerciseLines = day.data.exercises
        .map(
          (exercise) =>
            `<li><strong>${exercise.pattern}:</strong> ${exercise.name} — ${day.data.baseSets} × ${day.data.baseReps}</li>`
        )
        .join('');

      const finisher = day.data.conditioning
        ? `<li><strong>Conditioning:</strong> ${day.data.conditioning.name} — ${day.data.conditioning.details}</li>`
        : '';

      return `
        <article class="day-card">
          <h3>${day.dayLabel}</h3>
          <ul>
            ${exerciseLines}
            ${finisher}
          </ul>
          <p class="rest">${day.data.notes}</p>
          <p class="rest">Estimated time: 30-60 minutes</p>
        </article>
      `;
    })
    .join('');

  result.innerHTML = `
    <h2>Your Weekly Workout Plan</h2>
    <div class="plan-meta">
      <span><strong>Goal:</strong> ${input.goal}</span>
      <span><strong>Experience:</strong> ${input.experience}</span>
      <span><strong>Equipment:</strong> ${input.equipment}</span>
      <span><strong>Training days:</strong> ${input.daysPerWeek} per week</span>
    </div>
    <div class="week-layout">
      ${dayCards}
    </div>
  `;
  result.classList.remove('hidden');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const input = {
    goal: document.getElementById('goal').value,
    experience: document.getElementById('experience').value,
    daysPerWeek: Number(document.getElementById('days').value),
    equipment: document.getElementById('equipment').value
  };

  const plan = generateWeek(input.daysPerWeek, input.equipment, input.goal, input.experience);
  renderPlan(input, plan);
});
