import fs from 'fs';
import path from 'path';
import { 
  User, 
  AcademicYear, 
  ResponsibilityReference, 
  Evaluation, 
  AcademicMetrics, 
  ResearchMetrics, 
  FacultyResponsibility, 
  IndustrySocietalMetrics, 
  CalculatedScores, 
  EvaluationDetails 
} from './src/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  users: User[];
  academic_years: AcademicYear[];
  responsibility_reference: ResponsibilityReference[];
  evaluations: Evaluation[];
  academic_metrics: AcademicMetrics[];
  research_metrics: ResearchMetrics[];
  faculty_responsibilities: FacultyResponsibility[];
  industry_societal_metrics: IndustrySocietalMetrics[];
  weight_factor: number; // For academic workload hours scoring (default 0.5)
}

// Default Data Seed
const DEFAULT_USERS: User[] = [
  {
    user_id: 'F001',
    name: 'Dr. Jane Smith',
    email: 'jane.smith@tkmit.ac.in',
    designation: 'Associate Professor',
    department: 'Civil Engineering',
    role: 'Faculty'
  },
  {
    user_id: 'H001',
    name: 'Dr. Robert Carter',
    email: 'robert.carter@tkmit.ac.in',
    designation: 'Professor & HoD',
    department: 'Civil Engineering',
    role: 'HoD'
  },
  {
    user_id: 'D001',
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@tkmit.ac.in',
    designation: 'Professor & Dean',
    department: 'Computer Science',
    role: 'Dean'
  },
  {
    user_id: 'P001',
    name: 'Dr. Arthur Pendelton',
    email: 'principal@tkmit.ac.in',
    designation: 'Principal & Director',
    department: 'Electronics & Communication',
    role: 'Principal'
  }
];

const DEFAULT_AY: AcademicYear[] = [
  { ay_id: 1, year_string: '25-26' },
  { ay_id: 2, year_string: '26-27' }
];

const DEFAULT_RESPONSIBILITIES: ResponsibilityReference[] = [
  // Department Responsibilities (Max 10)
  { ref_id: 1, type: 'Department', responsibility_name: 'Department HoD / Head', role_designation: 'HoD', score_weight: 10 },
  { ref_id: 2, type: 'Department', responsibility_name: 'Department Placement Coordinator', role_designation: 'Placement Cell', score_weight: 6 },
  { ref_id: 3, type: 'Department', responsibility_name: 'Department Accreditation Coordinator (NBA/NAAC)', role_designation: 'Accreditation', score_weight: 8 },
  { ref_id: 4, type: 'Department', responsibility_name: 'Class Advisor / Student Mentor', role_designation: 'Mentorship', score_weight: 5 },
  { ref_id: 5, type: 'Department', responsibility_name: 'Laboratory In-Charge', role_designation: 'Lab Admin', score_weight: 4 },
  { ref_id: 6, type: 'Department', responsibility_name: 'Project and Seminar Coordinator', role_designation: 'Academics Coordinator', score_weight: 5 },
  { ref_id: 7, type: 'Department', responsibility_name: 'Exam Cell Department Coordinator', role_designation: 'Exam Cell', score_weight: 6 },

  // Institute Responsibilities (Max 10)
  { ref_id: 8, type: 'Institute', responsibility_name: 'Dean (Academic, R&D, Student Affairs)', role_designation: 'Dean', score_weight: 10 },
  { ref_id: 9, type: 'Institute', responsibility_name: 'Associate Dean / Assistant Dean', role_designation: 'Dean Assistant', score_weight: 8 },
  { ref_id: 10, type: 'Institute', responsibility_name: 'IQAC Coordinator / Member', role_designation: 'Quality Assurance', score_weight: 7 },
  { ref_id: 11, type: 'Institute', responsibility_name: 'NSS officer / NCC coordinator / Club Coordinator', role_designation: 'Extra-Curricular', score_weight: 6 },
  { ref_id: 12, type: 'Institute', responsibility_name: 'Anti-Ragging or Discipline Committee Member', role_designation: 'Student Welfare', score_weight: 5 },
  { ref_id: 13, type: 'Institute', responsibility_name: 'Chief Warden / Hostel Warden', role_designation: 'Warden', score_weight: 6 },
  { ref_id: 14, type: 'Institute', responsibility_name: 'ERP & College Website Administrator', role_designation: 'IT Admin', score_weight: 6 },
  { ref_id: 15, type: 'Institute', responsibility_name: 'Institution Innovation Council (IIC) President', role_designation: 'R&D/Innovation', score_weight: 7 }
];

// Sample evaluation to pre-populate the UI with data
const DEFAULT_EVALUATION: Evaluation = {
  evaluation_id: 1,
  user_id: 'F001',
  ay_id: 1,
  evaluation_date: '2026-06-01',
  is_submitted: true,
  hod_signed: true,
  hod_signed_date: '2026-06-02',
  hod_comments: 'Excellent class pass percentage and highly proactive in research.',
  dean_signed: false,
  dean_signed_date: undefined,
  dean_comments: undefined,
  principal_signed: false,
  principal_signed_date: undefined,
  principal_comments: undefined
};

const DEFAULT_ACADEMIC_METRICS: AcademicMetrics = {
  academic_id: 1,
  evaluation_id: 1,
  workload_lecture_hours: 12,
  workload_tutorial_hours: 2,
  workload_lab_hours: 4,
  workload_project_hours: 3,
  mandatory_class_hours: 60,
  engaged_class_hours: 58,
  student_feedback_score: 4.65,
  students_attended: 64,
  students_passed: 59,
  students_above_80_percent: 22,
  professional_development_points: 7
};

const DEFAULT_RESEARCH_METRICS: ResearchMetrics = {
  research_id: 1,
  evaluation_id: 1,
  pub_sci: 1,
  pub_scopus: 2,
  pub_conference: 2,
  pub_book: 0,
  pub_chapter: 1,
  inter_dept_authors: 1,
  patents_granted: 1,
  patents_published: 1,
  patents_filed: 0,
  other_ipr: 0,
  research_fund_granted_amt: 2500000, // Rs. 25 Lakhs
  research_fund_applied_amt: 1500000,
  consultancy_amt: 120000
};

const DEFAULT_FACULTY_RESPONSIBILITIES: FacultyResponsibility[] = [
  { id: 1, evaluation_id: 1, ref_id: 4 }, // Advisor (5 points)
  { id: 2, evaluation_id: 1, ref_id: 6 }, // Project Coordinator (5 points)
  { id: 3, evaluation_id: 1, ref_id: 11 } // Club Coordinator (6 points)
];

const DEFAULT_IND_SOC_METRICS: IndustrySocietalMetrics = {
  ind_soc_id: 1,
  evaluation_id: 1,
  startup_score: 0,
  industrial_training_days: 5,
  internship_days: 0,
  industrial_visit_days: 2,
  societal_activity_desc: 'Organized NSS Clean-up Campaign in the local vilage and delivered technology awareness program.',
  societal_points: 4
};

class DatabaseService {
  private data!: DatabaseSchema;

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure references exist
        if (!this.data.responsibility_reference || this.data.responsibility_reference.length === 0) {
          this.data.responsibility_reference = DEFAULT_RESPONSIBILITIES;
        }
        if (!this.data.users || this.data.users.length === 0) {
          this.data.users = DEFAULT_USERS;
        }
        if (this.data.weight_factor === undefined) {
          this.data.weight_factor = 0.5;
        }
      } catch (e) {
        console.error("Error reading database file, resetting to defaults...", e);
        this.resetToDefaults();
      }
    } else {
      this.resetToDefaults();
    }
  }

  public resetToDefaults() {
    this.data = {
      users: DEFAULT_USERS,
      academic_years: DEFAULT_AY,
      responsibility_reference: DEFAULT_RESPONSIBILITIES,
      evaluations: [DEFAULT_EVALUATION],
      academic_metrics: [DEFAULT_ACADEMIC_METRICS],
      research_metrics: [DEFAULT_RESEARCH_METRICS],
      faculty_responsibilities: DEFAULT_FACULTY_RESPONSIBILITIES,
      industry_societal_metrics: [DEFAULT_IND_SOC_METRICS],
      weight_factor: 0.5
    };
    this.save();
  }

  private save() {
    fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  // --- Users ---
  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.user_id === id);
  }

  public createUser (user: User): User {
    // Check if user exists
    const existing = this.getUserById(user.user_id);
    if (existing) {
      this.data.users = this.data.users.map(u => u.user_id === user.user_id ? user : u);
    } else {
      user.created_at = new Date().toISOString();
      this.data.users.push(user);
    }
    this.save();
    return user;
  }

  // --- Academic Years ---
  public getAcademicYears(): AcademicYear[] {
    return this.data.academic_years;
  }

  // --- References ---
  public getReferences(): ResponsibilityReference[] {
    return this.data.responsibility_reference;
  }

  public updateReference(ref: ResponsibilityReference): ResponsibilityReference {
    const idx = this.data.responsibility_reference.findIndex(r => r.ref_id === ref.ref_id);
    if (idx !== -1) {
      this.data.responsibility_reference[idx] = ref;
    } else {
      ref.ref_id = Math.max(0, ...this.data.responsibility_reference.map(r => r.ref_id)) + 1;
      this.data.responsibility_reference.push(ref);
    }
    this.save();
    return ref;
  }

  public deleteReference(refId: number): boolean {
    const len = this.data.responsibility_reference.length;
    this.data.responsibility_reference = this.data.responsibility_reference.filter(r => r.ref_id !== refId);
    if (this.data.responsibility_reference.length < len) {
      // Clean up linked faculty responsibilities
      this.data.faculty_responsibilities = this.data.faculty_responsibilities.filter(r => r.ref_id !== refId);
      this.save();
      return true;
    }
    return false;
  }

  // --- Weight Factor ---
  public getWeightFactor(): number {
    return this.data.weight_factor;
  }

  public updateWeightFactor(factor: number) {
    this.data.weight_factor = factor;
    this.save();
  }

  // --- Evaluations & Calculations ---
  public getEvaluations(): Evaluation[] {
    return this.data.evaluations;
  }

  public getEvaluationDetailsByUserIdAndAy(userId: string, ayId: number): EvaluationDetails | null {
    const faculty = this.getUserById(userId);
    if (!faculty) return null;

    const academicYear = this.data.academic_years.find(ay => ay.ay_id === ayId);
    if (!academicYear) return null;

    let evaluation = this.data.evaluations.find(e => e.user_id === userId && e.ay_id === ayId);
    if (!evaluation) {
      // Create empty evaluation on demand
      const evalId = Math.max(0, ...this.data.evaluations.map(e => e.evaluation_id)) + 1;
      evaluation = {
        evaluation_id: evalId,
        user_id: userId,
        ay_id: ayId,
        evaluation_date: new Date().toISOString().split('T')[0],
        is_submitted: false,
        hod_signed: false,
        dean_signed: false,
        principal_signed: false
      };
      this.data.evaluations.push(evaluation);
      this.save();
    }

    let academicMetrics = this.data.academic_metrics.find(am => am.evaluation_id === evaluation!.evaluation_id);
    if (!academicMetrics) {
      const amId = Math.max(0, ...this.data.academic_metrics.map(am => am.academic_id)) + 1;
      academicMetrics = {
        academic_id: amId,
        evaluation_id: evaluation.evaluation_id,
        workload_lecture_hours: 0,
        workload_tutorial_hours: 0,
        workload_lab_hours: 0,
        workload_project_hours: 0,
        mandatory_class_hours: 0,
        engaged_class_hours: 0,
        student_feedback_score: 0,
        students_attended: 0,
        students_passed: 0,
        students_above_80_percent: 0,
        professional_development_points: 0
      };
      this.data.academic_metrics.push(academicMetrics);
      this.save();
    }

    let researchMetrics = this.data.research_metrics.find(rm => rm.evaluation_id === evaluation!.evaluation_id);
    if (!researchMetrics) {
      const rmId = Math.max(0, ...this.data.research_metrics.map(rm => rm.research_id)) + 1;
      researchMetrics = {
        research_id: rmId,
        evaluation_id: evaluation.evaluation_id,
        pub_sci: 0,
        pub_scopus: 0,
        pub_conference: 0,
        pub_book: 0,
        pub_chapter: 0,
        inter_dept_authors: 0,
        patents_granted: 0,
        patents_published: 0,
        patents_filed: 0,
        other_ipr: 0,
        research_fund_granted_amt: 0,
        research_fund_applied_amt: 0,
        consultancy_amt: 0
      };
      this.data.research_metrics.push(researchMetrics);
      this.save();
    }

    let industrySocietalMetrics = this.data.industry_societal_metrics.find(ism => ism.evaluation_id === evaluation!.evaluation_id);
    if (!industrySocietalMetrics) {
      const ismId = Math.max(0, ...this.data.industry_societal_metrics.map(ism => ism.ind_soc_id)) + 1;
      industrySocietalMetrics = {
        ind_soc_id: ismId,
        evaluation_id: evaluation.evaluation_id,
        startup_score: 0,
        industrial_training_days: 0,
        internship_days: 0,
        industrial_visit_days: 0,
        societal_activity_desc: '',
        societal_points: 0
      };
      this.data.industry_societal_metrics.push(industrySocietalMetrics);
      this.save();
    }

    // Get linked responsibilities references
    const linkedRespIds = this.data.faculty_responsibilities
      .filter(fr => fr.evaluation_id === evaluation!.evaluation_id)
      .map(fr => fr.ref_id);
    
    const responsibilities = this.data.responsibility_reference
      .filter(ref => linkedRespIds.includes(ref.ref_id));

    // Calculate Scores real-time
    const calculatedScores = this.computeScores(academicMetrics, researchMetrics, responsibilities, industrySocietalMetrics);

    return {
      evaluation,
      faculty,
      academicYear,
      academicMetrics,
      researchMetrics,
      responsibilities,
      industrySocietalMetrics,
      calculatedScores
    };
  }

  public updateAcademicMetrics(metrics: AcademicMetrics): AcademicMetrics {
    const idx = this.data.academic_metrics.findIndex(m => m.academic_id === metrics.academic_id);
    if (idx !== -1) {
      this.data.academic_metrics[idx] = metrics;
    } else {
      this.data.academic_metrics.push(metrics);
    }
    this.save();
    return metrics;
  }

  public updateResearchMetrics(metrics: ResearchMetrics): ResearchMetrics {
    const idx = this.data.research_metrics.findIndex(m => m.research_id === metrics.research_id);
    if (idx !== -1) {
      this.data.research_metrics[idx] = metrics;
    } else {
      this.data.research_metrics.push(metrics);
    }
    this.save();
    return metrics;
  }

  public updateIndustrySocietalMetrics(metrics: IndustrySocietalMetrics): IndustrySocietalMetrics {
    const idx = this.data.industry_societal_metrics.findIndex(m => m.ind_soc_id === metrics.ind_soc_id);
    if (idx !== -1) {
      this.data.industry_societal_metrics[idx] = metrics;
    } else {
      this.data.industry_societal_metrics.push(metrics);
    }
    this.save();
    return metrics;
  }

  public updateFacultyResponsibilities(evalId: number, refIds: number[]): ResponsibilityReference[] {
    // Delete existing records for this evaluation
    this.data.faculty_responsibilities = this.data.faculty_responsibilities.filter(r => r.evaluation_id !== evalId);

    // Insert new ones
    refIds.forEach(refId => {
      const id = Math.max(0, ...this.data.faculty_responsibilities.map(r => r.id)) + 1;
      this.data.faculty_responsibilities.push({ id, evaluation_id: evalId, ref_id: refId });
    });

    this.save();

    // Get reference records
    return this.data.responsibility_reference.filter(ref => refIds.includes(ref.ref_id));
  }

  public submitEvaluation(evalId: number): boolean {
    const idx = this.data.evaluations.findIndex(e => e.evaluation_id === evalId);
    if (idx !== -1) {
      this.data.evaluations[idx].is_submitted = true;
      this.data.evaluations[idx].evaluation_date = new Date().toISOString().split('T')[0];
      this.save();
      return true;
    }
    return false;
  }

  public signOffEvaluation(evalId: number, role: 'HoD' | 'Dean' | 'Principal', comments: string, action: 'approve' | 'reject'): boolean {
    const idx = this.data.evaluations.findIndex(e => e.evaluation_id === evalId);
    if (idx !== -1) {
      const dateStr = new Date().toISOString().split('T')[0];
      if (role === 'HoD') {
        this.data.evaluations[idx].hod_signed = action === 'approve';
        this.data.evaluations[idx].hod_signed_date = action === 'approve' ? dateStr : undefined;
        this.data.evaluations[idx].hod_comments = comments;
      } else if (role === 'Dean') {
        this.data.evaluations[idx].dean_signed = action === 'approve';
        this.data.evaluations[idx].dean_signed_date = action === 'approve' ? dateStr : undefined;
        this.data.evaluations[idx].dean_comments = comments;
      } else if (role === 'Principal') {
        this.data.evaluations[idx].principal_signed = action === 'approve';
        this.data.evaluations[idx].principal_signed_date = action === 'approve' ? dateStr : undefined;
        this.data.evaluations[idx].principal_comments = comments;
      }
      this.save();
      return true;
    }
    return false;
  }

  // --- Formulas Mapping Engine ---
  public computeScores(
    acad: AcademicMetrics,
    res: ResearchMetrics,
    resp: ResponsibilityReference[],
    indSoc: IndustrySocietalMetrics
  ): CalculatedScores {
    // 1. Academics Column (Max Score: 40)
    const totalWorkloadHours = 
      Number(acad.workload_lecture_hours) + 
      Number(acad.workload_tutorial_hours) + 
      Number(acad.workload_lab_hours) + 
      Number(acad.workload_project_hours);
    
    // Workload Score: Cap total raw hours * Academic Workload factor (default 0.5) to max 10
    const workloadScore = Math.min(10, totalWorkloadHours * this.data.weight_factor);

    // Class Engagement %
    let classEngagementPct = 0;
    if (acad.mandatory_class_hours > 0) {
      classEngagementPct = Math.min(100, (acad.engaged_class_hours / acad.mandatory_class_hours) * 100);
    }
    // Engagement Score threshold mappings
    let engagementScore = 0;
    if (classEngagementPct >= 95) engagementScore = 10;
    else if (classEngagementPct >= 90) engagementScore = 9;
    else if (classEngagementPct >= 85) engagementScore = 8;
    else if (classEngagementPct >= 80) engagementScore = 7;
    else if (classEngagementPct >= 75) engagementScore = 6;
    else engagementScore = 0;

    // Students Success Rate
    let passPct = 0;
    if (acad.students_attended > 0) {
      passPct = Math.min(100, (acad.students_passed / acad.students_attended) * 100);
    }
    let successRatePoints = 0;
    if (passPct >= 95) successRatePoints = 6;
    else if (passPct >= 90) successRatePoints = 5;
    else if (passPct >= 80) successRatePoints = 4;
    else if (passPct >= 70) successRatePoints = 3;
    else if (passPct >= 60) successRatePoints = 2;
    else successRatePoints = 0;

    // Student Feedback Score
    const feedbackPoints = Math.min(5, Number(acad.student_feedback_score));

    // Professional Development Points: Up to remaining max of 9
    const profDevPoints = Math.min(9, Number(acad.professional_development_points));

    const academicSubtotal = Math.min(40, workloadScore + engagementScore + successRatePoints + feedbackPoints + profDevPoints);

    // 2. Research & Consultancy Column (Max Score: 30)
    // Pub Point = (SCI * 5) + (Scopus * 3) + (Conference * 1) + (Book * 2) + (Book Chapter * 1)
    const pubPointsSrc = 
      (Number(res.pub_sci) * 5) + 
      (Number(res.pub_scopus) * 3) + 
      (Number(res.pub_conference) * 1) + 
      (Number(res.pub_book) * 2) +
      (Number(res.pub_chapter) * 1);
    
    // Bonus Points = Inter-department collaborations * 1
    const bonusPoints = Number(res.inter_dept_authors) * 1;

    // Patents Score: Granted = 10 pts, Published = 5 pts, Filed = 2 pts, Other IPR = 1 pt each
    const patentPoints = 
      (Number(res.patents_granted) * 10) + 
      (Number(res.patents_published) * 5) + 
      (Number(res.patents_filed) * 2) + 
      (Number(res.other_ipr) * 1);

    // Research Fund Score: Projects >= 2,000,000 counts as 10 points. If below, let's designate 5 pts. 
    // And Applied projects counts as 2 points if amount > 0.
    let researchFundPoints = 0;
    if (Number(res.research_fund_granted_amt) >= 2000000) {
      researchFundPoints = 10;
    } else if (Number(res.research_fund_granted_amt) > 0) {
      researchFundPoints = 5;
    }
    if (Number(res.research_fund_applied_amt) > 0) {
      researchFundPoints += 2; // applied bonus
    }
    researchFundPoints = Math.min(10, researchFundPoints); // Cap research fund score component at 10

    // Consultancy Scale: 1 point per 40,000 generated (e.g. up to Max 5)
    const consultancyPoints = Math.min(5, Number(res.consultancy_amt) / 40000);

    const researchSubtotal = Math.min(30, (pubPointsSrc + bonusPoints) + patentPoints + researchFundPoints + consultancyPoints);

    // 3. Administrative Responsibilities (Max Score: 20)
    // Dept Responsibilities: Sum weights capped at 10
    const deptAdminPoints = Math.min(
      10, 
      resp.filter(r => r.type === 'Department').reduce((sum, r) => sum + r.score_weight, 0)
    );

    // Institute Responsibilities: Sum weights capped at 10
    const instAdminPoints = Math.min(
      10, 
      resp.filter(r => r.type === 'Institute').reduce((sum, r) => sum + r.score_weight, 0)
    );

    const adminSubtotal = deptAdminPoints + instAdminPoints; // Max 20

    // 4. Industrial and Societal Subtotal (Max Score: 10)
    // Startup score: if there is an active startup, 5 points
    const startupPoints = Number(indSoc.startup_score) > 0 ? 5 : 0;

    // Training / Internship / Industrial Visit durations:
    const totalDays = Number(indSoc.industrial_training_days) + Number(indSoc.internship_days) + Number(indSoc.industrial_visit_days);
    let industrialTrainingPoints = 0;
    if (totalDays >= 15) industrialTrainingPoints = 5;
    else if (totalDays >= 10) industrialTrainingPoints = 4;
    else if (totalDays >= 5) industrialTrainingPoints = 3;
    else if (totalDays >= 1) industrialTrainingPoints = 2;

    const societalPoints = Math.min(5, Number(indSoc.societal_points));

    const indSocSubtotal = Math.min(10, startupPoints + industrialTrainingPoints + societalPoints);

    // 5. Grand Institutional Development Index
    const grandIndexScore = Math.round((academicSubtotal + researchSubtotal + adminSubtotal + indSocSubtotal) * 100) / 100;

    let finalIndexRating = 'Needs Improvement';
    if (grandIndexScore >= 90) finalIndexRating = 'Excellent (Outstanding)';
    else if (grandIndexScore >= 80) finalIndexRating = 'Very Good';
    else if (grandIndexScore >= 70) finalIndexRating = 'Good';
    else if (grandIndexScore >= 60) finalIndexRating = 'Satisfactory';

    return {
      totalWorkloadHours,
      workloadScore,
      classEngagementPct,
      engagementScore,
      passPct,
      successRatePoints,
      feedbackPoints,
      profDevPoints,
      academicSubtotal,

      pubPoints: pubPointsSrc,
      bonusPoints,
      patentPoints,
      researchFundPoints,
      consultancyPoints,
      researchSubtotal,

      deptAdminPoints,
      instAdminPoints,
      adminSubtotal,

      startupPoints,
      industrialTrainingPoints,
      societalPoints,
      indSocSubtotal,

      grandIndexScore,
      finalIndexRating
    };
  }
}

export const dbService = new DatabaseService();
