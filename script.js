const form = document.getElementById('workout-form');
const result = document.getElementById('result');

const exerciseBank = {
  home: {
    squat: ['Bodyweight Squat', 'Split Squat', 'Tempo Squat', 'Reverse Lunge'],
    hinge: ['Glute Bridge', 'Single-Leg Hip Hinge', 'Hip Thrust', 'Hamstring Walkout'],
    push: ['Knee Push-Up', 'Push-Up', 'Pike Push-Up', 'Incline Push-Up'],
    pull: ['Doorway Row (towel)', 'Prone Y-T-W Raises', 'Back Widow', 'Table Row'],
    core: ['Dead Bug', 'Plank', 'Side Plank', 'Bird Dog'],
    upperAccessory: ['Shoulder Tap Push-Up', 'Wall Slide', 'Rear Delt Raise (prone)'],
    lowerAccessory: ['Step-Up', 'Single-Leg Glute Bridge', 'Calf Raise']
  },
  dumbbells: {
    squat: ['Goblet Squat', 'Dumbbell Split Squat', 'Dumbbell Step-Up', 'Front-Foot Elevated Split Squat'],
    hinge: ['Dumbbell Romanian Deadlift', 'Dumbbell Hip Thrust', 'Dumbbell Good Morning', 'Single-Leg RDL'],
    push: ['Dumbbell Floor Press', 'Dumbbell Overhead Press', 'Incline Push-Up', 'Dumbbell Incline Press'],
    pull: ['One-Arm Dumbbell Row', 'Chest-Supported DB Row', 'Reverse Fly', 'Renegade Row'],
    core: ['Dead Bug', 'Plank with DB Drag', 'Suitcase Carry', 'Hollow Hold'],
    upperAccessory: ['Dumbbell Lateral Raise', 'Hammer Curl', 'Overhead Triceps Extension'],
    lowerAccessory: ['Dumbbell Walking Lunge', 'Dumbbell Calf Raise', 'B-Stance RDL']
  },
  'full gym': {
    squat: ['Back Squat', 'Leg Press', 'Walking Lunge', 'Goblet Squat'],
    hinge: ['Romanian Deadlift', 'Cable Pull-Through', 'Hip Thrust', 'Back Extension'],
    push: ['Bench Press', 'Seated DB Shoulder Press', 'Machine Chest Press', 'Incline DB Press'],
    pull: ['Lat Pulldown', 'Seated Cable Row', 'Assisted Pull-Up', 'Chest-Supported Row'],
    core: ['Cable Pallof Press', 'Plank', 'Hanging Knee Raise', 'Ab Wheel Rollout'],
    upperAccessory: ['Cable Lateral Raise', 'EZ-Bar Curl', 'Rope Triceps Pushdown'],
    lowerAccessory: ['Leg Extension', 'Leg Curl', 'Seated Calf Raise']
  }
};

function pickNonRepeating(list, rotationIndex, previousDayExercises) {
  for (let i = 0; i < list.length; i += 1) {
    const candidate = list[(rotationIndex + i) % list.length];
    if (!previousDayExercises.has(candidate)) {
      return candidate;
    }
  }

  return list[rotationIndex % list.length];
}

function getPrescription(goal, experience) {
  const isBeginner = experience === 'beginner';
  const baseSets = isBeginner ? '2-3 sets' : '3-4 sets';
  const baseReps = goal === 'strength' ? '8-10 reps' : '10-12 reps';
  const accessorySets = isBeginner ? '2 sets' : '2-3 sets';
  const accessoryReps = '10-12 reps';
  return { baseSets, baseReps, accessorySets, accessoryReps, isBeginner };
}

function getWeeklyStructure(daysPerWeek) {
  if (daysPerWeek <= 3) {
    return Array.from({ length: daysPerWeek }, () => ({
      name: 'Full Body',
      slots: [
        { pattern: 'Squat', key: 'squat', volume: 'base' },
        { pattern: 'Hinge', key: 'hinge', volume: 'base' },
        { pattern: 'Push', key: 'push', volume: 'base' },
        { pattern: 'Pull', key: 'pull', volume: 'base' },
        { pattern: 'Core', key: 'core', volume: 'base' }
      ]
    }));
  }

  if (daysPerWeek === 4) {
    return [
      {
        name: 'Upper Body A',
        slots: [
          { pattern: 'Push', key: 'push', volume: 'base' },
          { pattern: 'Pull', key: 'pull', volume: 'base' },
          { pattern: 'Push (Accessory)', key: 'upperAccessory', volume: 'accessory' },
          { pattern: 'Core', key: 'core', volume: 'base' }
        ]
      },
      {
        name: 'Lower Body A',
        slots: [
          { pattern: 'Squat', key: 'squat', volume: 'base' },
          { pattern: 'Hinge', key: 'hinge', volume: 'base' },
          { pattern: 'Lower Accessory', key: 'lowerAccessory', volume: 'accessory' },
          { pattern: 'Core', key: 'core', volume: 'base' }
        ]
      },
      {
        name: 'Upper Body B',
        slots: [
          { pattern: 'Pull', key: 'pull', volume: 'base' },
          { pattern: 'Push', key: 'push', volume: 'base' },
          { pattern: 'Upper Accessory', key: 'upperAccessory', volume: 'accessory' },
          { pattern: 'Core', key: 'core', volume: 'base' }
        ]
      },
      {
        name: 'Lower Body B',
        slots: [
          { pattern: 'Hinge', key: 'hinge', volume: 'base' },
          { pattern: 'Squat', key: 'squat', volume: 'base' },
          { pattern: 'Lower Accessory', key: 'lowerAccessory', volume: 'accessory' },
          { pattern: 'Core', key: 'core', volume: 'base' }
        ]
      }
    ];
  }

  return [
    {
      name: 'Push',
      slots: [
        { pattern: 'Push', key: 'push', volume: 'base' },
        { pattern: 'Upper Accessory', key: 'upperAccessory', volume: 'accessory' },
        { pattern: 'Core', key: 'core', volume: 'base' }
      ]
    },
    {
      name: 'Pull',
      slots: [
        { pattern: 'Pull', key: 'pull', volume: 'base' },
        { pattern: 'Upper Accessory', key: 'upperAccessory', volume: 'accessory' },
        { pattern: 'Core', key: 'core', volume: 'base' }
      ]
    },
    {
      name: 'Legs',
      slots: [
        { pattern: 'Squat', key: 'squat', volume: 'base' },
        { pattern: 'Hinge', key: 'hinge', volume: 'base' },
        { pattern: 'Lower Accessory', key: 'lowerAccessory', volume: 'accessory' },
        { pattern: 'Core', key: 'core', volume: 'base' }
      ]
    },
    {
      name: 'Upper Accessory',
      slots: [
        { pattern: 'Push', key: 'push', volume: 'base' },
        { pattern: 'Pull', key: 'pull', volume: 'base' },
        { pattern: 'Upper Accessory', key: 'upperAccessory', volume: 'accessory' },
        { pattern: 'Core', key: 'core', volume: 'base' }
      ]
    },
    {
      name: 'Lower Accessory',
      slots: [
        { pattern: 'Squat', key: 'squat', volume: 'base' },
        { pattern: 'Hinge', key: 'hinge', volume: 'base' },
        { pattern: 'Lower Accessory', key: 'lowerAccessory', volume: 'accessory' },
        { pattern: 'Core', key: 'core', volume: 'base' }
      ]
    }
  ];
}

function buildWorkout(session, dayIndex, equipment, goal, experience, previousDayExercises) {
  const bank = exerciseBank[equipment];
  const prescription = getPrescription(goal, experience);

  const exercises = session.slots.map((slot, slotIndex) => {
    const options = bank[slot.key];
    const name = pickNonRepeating(options, dayIndex + slotIndex, previousDayExercises);
    const details =
      slot.volume === 'accessory'
        ? `${prescription.accessorySets} × ${prescription.accessoryReps}`
        : `${prescription.baseSets} × ${prescription.baseReps}`;

    return { pattern: slot.pattern, name, details };
  });

  const conditioning =
    goal === 'weight loss'
      ? {
          name: 'Brisk walk / bike / easy circuit finisher',
          details: '10-15 minutes moderate pace'
        }
      : null;

  const notes = prescription.isBeginner
    ? 'Rest 60-90 sec between sets. Keep 1-2 reps in reserve.'
    : 'Rest 60-120 sec between sets. Add load gradually week to week.';

  return { title: session.name, exercises, conditioning, notes };
}

function distributeWorkoutsAcrossWeek(workouts) {
  const week = [];
  let workoutIndex = 0;

  for (let day = 1; day <= 7; day += 1) {
    const workoutsLeft = workouts.length - workoutIndex;
    const daysLeft = 8 - day;
    const shouldTrain = workoutsLeft > 0 && (day % 2 === 1 || workoutsLeft >= daysLeft);

    if (shouldTrain) {
      week.push({
        type: 'workout',
        dayLabel: `Day ${workoutIndex + 1}`,
        data: workouts[workoutIndex]
      });
      workoutIndex += 1;
    } else {
      week.push({ type: 'rest', dayLabel: `Rest Day ${day}` });
    }
  }

  return week;
}

function generateWeek(daysPerWeek, equipment, goal, experience) {
  const structure = getWeeklyStructure(daysPerWeek);
  const workouts = [];
  let previousDayExercises = new Set();

  structure.forEach((session, sessionIndex) => {
    const workout = buildWorkout(
      session,
      sessionIndex,
      equipment,
      goal,
      experience,
      previousDayExercises
    );

    workouts.push(workout);
    previousDayExercises = new Set(workout.exercises.map((exercise) => exercise.name));
  });

  return distributeWorkoutsAcrossWeek(workouts);
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
            `<li><strong>${exercise.pattern}:</strong> ${exercise.name} — ${exercise.details}</li>`
        )
        .join('');

      const finisher = day.data.conditioning
        ? `<li><strong>Conditioning:</strong> ${day.data.conditioning.name} — ${day.data.conditioning.details}</li>`
        : '';

      return `
        <article class="day-card">
          <h3>${day.dayLabel}: ${day.data.title}</h3>
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
