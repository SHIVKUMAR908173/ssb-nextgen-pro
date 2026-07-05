export type ObstacleConfig = {
  id: number;
  name: string;
  marks: number;
  timeLimit: number;
  desc: string;
  color: string;
  instruction: string;
  technique: string;
};

// Standard SSB IO sequence
export const IO_OBSTACLES: ObstacleConfig[] = [
  { id: 1, name: 'Monkey Crawl', marks: 2, timeLimit: 25, desc: 'Crawl face-up along a horizontal rope using hands and feet', color: 'emerald', instruction: 'Hold the rope with both hands and feet, face upward. Move forward using alternating hand-foot coordination. Don\'t let your body sag!', technique: 'Hook ankles over rope, pull with arms, push with legs in rhythm.' },
  { id: 2, name: 'Double Ditch', marks: 3, timeLimit: 20, desc: 'Jump across two consecutive ditches without stopping', color: 'blue', instruction: 'Sprint and jump the first ditch, maintain momentum, immediately jump the second. Land on both feet.', technique: 'Build speed in approach run. Jump at 45° angle. Use arms for thrust.' },
  { id: 3, name: 'Zig-Zag Balance', marks: 2, timeLimit: 30, desc: 'Walk across a zig-zag wooden beam without falling', color: 'amber', instruction: 'Arms out for balance. Look at the end point, not your feet. Walk heel-to-toe at each turn.', technique: 'Shift weight to the inner foot at each turn. Slow and steady wins.' },
  { id: 4, name: 'High Jump', marks: 4, timeLimit: 15, desc: 'Jump over a bar set at increasing heights', color: 'red', instruction: 'Approach at 30° angle. Plant the takeoff foot firmly. Scissors kick over the bar.', technique: 'Approach from dominant side. Drive knee up aggressively. Arch over the bar.' },
  { id: 5, name: 'Long Jump', marks: 3, timeLimit: 15, desc: 'Clear a marked distance in a single leap', color: 'purple', instruction: 'Full sprint approach. Hit the board with your stronger foot. Extend both legs forward on landing.', technique: 'Build max speed. Jump at 20-25° angle. Swing arms forward on takeoff.' },
  { id: 6, name: 'Rope Climbing', marks: 5, timeLimit: 40, desc: 'Climb a vertical rope to touch the top marker', color: 'orange', instruction: 'Lock the rope between your feet. Pull up with both arms, push up with legs. Alternate grip-pull-push.', technique: 'S-wrap: rope over one foot, under the other. Use legs more than arms to conserve energy.' },
  { id: 7, name: 'Tarzan Swing', marks: 4, timeLimit: 20, desc: 'Swing across a gap using a hanging rope', color: 'cyan', instruction: 'Grip high on the rope. Run and jump, swing your body forward. Release at the highest point.', technique: 'Grip overhand. Tuck knees at bottom of swing for momentum. Extend legs before release.' },
  { id: 8, name: 'Burma Bridge', marks: 3, timeLimit: 35, desc: 'Cross a rope bridge using one foot rope and two hand ropes', color: 'lime', instruction: 'Stand on bottom rope, hold both side ropes. Shuffle sideways. Keep center of gravity low.', technique: 'Move one foot at a time. Grip side ropes firmly. Look ahead, not down.' },
  { id: 9, name: 'Commando Walk', marks: 3, timeLimit: 25, desc: 'Walk across a single log elevated at height', color: 'pink', instruction: 'Step confidently. Arms out to sides. Walk in a straight line looking at the far end.', technique: 'Small quick steps. Engage core for balance. Don\'t stop in the middle.' },
  { id: 10, name: 'Screen Jump', marks: 5, timeLimit: 20, desc: 'Jump from height onto a net/screen and climb down', color: 'yellow', instruction: 'Stand at the edge. Jump outward (not downward). Grab the net on landing. Climb down controlled.', technique: 'Bend knees on impact. Grab with both hands immediately. Descend using 3-point contact.' },
];

export type IOSessionConfig = {
  sessionId: string;
};

export type IOSessionInitResult = {
  obstacles: ObstacleConfig[];
  totalTimeLimit: number;
};

export type IOObstacleResult = {
  obstacleId: number;
  completed: boolean;
  timeTaken: number;
};

export type IOSessionSubmitInput = {
  sessionId: string;
  results: IOObstacleResult[];
};

export type IOSessionSubmitResult = {
  totalScore: number;
  maxScore: number;
  completedCount: number;
  ratingLabel: string;
  ratingDesc: string;
  breakdown: Array<{ obstacleId: number; scoreAwarded: number }>;
};

export function initIOSession(config: IOSessionConfig): IOSessionInitResult {
  return {
    obstacles: IO_OBSTACLES,
    totalTimeLimit: 180 // 3 minutes total for the real IO course
  };
}

export function submitIOSession(input: IOSessionSubmitInput): IOSessionSubmitResult {
  let totalScore = 0;
  const maxScore = IO_OBSTACLES.reduce((sum, o) => sum + o.marks, 0);
  let completedCount = 0;
  
  const breakdown: Array<{ obstacleId: number; scoreAwarded: number }> = [];

  for (const res of input.results) {
    const obstacle = IO_OBSTACLES.find(o => o.id === res.obstacleId);
    if (!obstacle) continue;

    let scoreAwarded = 0;
    if (res.completed) {
      completedCount++;
      const timeRatio = res.timeTaken / obstacle.timeLimit;
      if (timeRatio <= 0.5) scoreAwarded = obstacle.marks;
      else if (timeRatio <= 0.75) scoreAwarded = Math.ceil(obstacle.marks * 0.75);
      else scoreAwarded = Math.ceil(obstacle.marks * 0.5);
      
      totalScore += scoreAwarded;
    }
    
    breakdown.push({ obstacleId: res.obstacleId, scoreAwarded });
  }

  // Rating based on total score
  const pct = (totalScore / maxScore) * 100;
  let ratingLabel = '';
  let ratingDesc = '';
  
  if (pct >= 85) {
    ratingLabel = 'OUTSTANDING';
    ratingDesc = 'Board-recommended performance. You demonstrated exceptional physical courage and determination.';
  } else if (pct >= 65) {
    ratingLabel = 'ABOVE AVERAGE';
    ratingDesc = 'Strong showing. Your stamina and speed of decision are commendable.';
  } else if (pct >= 45) {
    ratingLabel = 'AVERAGE';
    ratingDesc = 'Decent attempt. Focus on building upper body strength and explosive power.';
  } else {
    ratingLabel = 'BELOW AVERAGE';
    ratingDesc = 'Needs significant improvement. Daily physical training is non-negotiable.';
  }

  return {
    totalScore,
    maxScore,
    completedCount,
    ratingLabel,
    ratingDesc,
    breakdown
  };
}
