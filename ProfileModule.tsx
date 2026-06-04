/**
 * Types & Interfaces for Faculty Performance Evaluation and Appraisal System
 */

export type UserRole = 'Faculty' | 'HoD' | 'Dean' | 'Principal';

export interface User {
  user_id: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  role: UserRole;
  created_at?: string;
}

export interface AcademicYear {
  ay_id: number;
  year_string: string;
}

export interface ResponsibilityReference {
  ref_id: number;
  type: 'Department' | 'Institute';
  responsibility_name: string;
  role_designation: string;
  score_weight: number;
}

export interface Evaluation {
  evaluation_id: number;
  user_id: string;
  ay_id: number;
  evaluation_date: string;
  is_submitted: boolean;
  hod_signed: boolean;
  hod_signed_date?: string;
  hod_comments?: string;
  dean_signed: boolean;
  dean_signed_date?: string;
  dean_comments?: string;
  principal_signed: boolean;
  principal_signed_date?: string;
  principal_comments?: string;
}

export interface AcademicMetrics {
  academic_id: number;
  evaluation_id: number;
  workload_lecture_hours: number;
  workload_tutorial_hours: number;
  workload_lab_hours: number;
  workload_project_hours: number;
  mandatory_class_hours: number;
  engaged_class_hours: number;
  student_feedback_score: number; // up to 5.0
  students_attended: number;
  students_passed: number;
  students_above_80_percent: number;
  professional_development_points: number; // max 9
}

export interface ResearchMetrics {
  research_id: number;
  evaluation_id: number;
  pub_sci: number;
  pub_scopus: number;
  pub_conference: number;
  pub_book: number;
  pub_chapter: number;
  inter_dept_authors: number;
  patents_granted: number;
  patents_published: number;
  patents_filed: number;
  other_ipr: number;
  research_fund_granted_amt: number;
  research_fund_applied_amt: number;
  consultancy_amt: number;
}

export interface FacultyResponsibility {
  id: number;
  evaluation_id: number;
  ref_id: number;
}

export interface IndustrySocietalMetrics {
  ind_soc_id: number;
  evaluation_id: number;
  startup_score: number;
  industrial_training_days: number;
  internship_days: number;
  industrial_visit_days: number;
  societal_activity_desc: string;
  societal_points: number;
}

// Full evaluation details package returned to front-end
export interface EvaluationDetails {
  evaluation: Evaluation;
  faculty: User;
  academicYear: AcademicYear;
  academicMetrics: AcademicMetrics;
  researchMetrics: ResearchMetrics;
  responsibilities: ResponsibilityReference[];
  industrySocietalMetrics: IndustrySocietalMetrics;
  calculatedScores: CalculatedScores;
}

export interface CalculatedScores {
  // Academic Metrics
  totalWorkloadHours: number;
  workloadScore: number;
  classEngagementPct: number;
  engagementScore: number;
  passPct: number;
  successRatePoints: number;
  feedbackPoints: number;
  profDevPoints: number;
  academicSubtotal: number; // Max 40

  // Research Metrics
  pubPoints: number;
  bonusPoints: number;
  patentPoints: number;
  researchFundPoints: number;
  consultancyPoints: number;
  researchSubtotal: number; // Max 30

  // Administrative Metrics
  deptAdminPoints: number;
  instAdminPoints: number;
  adminSubtotal: number; // Max 20

  // Societal / Industrial Metrics
  startupPoints: number;
  industrialTrainingPoints: number;
  societalPoints: number;
  indSocSubtotal: number; // Max 10

  // Grand Index
  grandIndexScore: number; // Max 100
  finalIndexRating: string; // Excellent, Very Good, Good, Satisfactory, Needs Improvement
}
