import { Request, Response } from 'express';
import Submission from '../models/Submission';
import Assignment from '../models/Assignment';
import { AuthRequest } from '../middleware/auth';

interface SubmissionRequestBody {
  assignmentId: string;
  content?: string;
  filePath?: string;
}

// @desc    Submit assignment
// @route   POST /api/submissions
// @access  Private - Student
export const submitAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { assignmentId, content, filePath } = req.body;

    // Check if assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if assignment is still active and not overdue
    if (!assignment.isActive) {
      return res.status(400).json({ message: 'Assignment is not active' });
    }

    if (new Date() > new Date(assignment.dueDate)) {
      return res.status(400).json({ message: 'Assignment deadline has passed' });
    }

    // Check if user has already submitted
    const existingSubmission = await Submission.findOne({
      assignmentId,
      userId: req.user?._id
    });

    if (existingSubmission) {
      return res.status(400).json({ message: 'Assignment already submitted' });
    }

    const submission = await Submission.create({
      assignmentId,
      userId: req.user?._id,
      content,
      filePath
    });

    res.status(201).json({
      success: true,
      data: submission
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get submissions by assignment
// @route   GET /api/submissions
// @access  Private - Admin/Faculty
export const getSubmissionsByAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { assignmentId } = req.query;

    if (!assignmentId) {
      return res.status(400).json({ message: 'Assignment ID is required' });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if user has permission to view submissions for this assignment
    if (req.user?.role !== 'admin' && assignment.createdBy.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view submissions for this assignment' });
    }

    const submissions = await Submission.find({ assignmentId })
      .populate('userId', 'firstName lastName email')
      .populate({ path: 'assignmentId', populate: { path: 'createdBy', select: 'firstName lastName email' } })
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my submissions
// @route   GET /api/submissions/my-submissions
// @access  Private - Student
export const getMySubmissions = async (req: AuthRequest, res: Response) => {
  try {
    const submissions = await Submission.find({ userId: req.user?._id })
      .populate({ path: 'assignmentId', populate: { path: 'createdBy', select: 'firstName lastName email' } })
      .populate('userId', 'firstName lastName email')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get submission by ID
// @route   GET /api/submissions/:id
// @access  Private
export const getSubmissionById = async (req: AuthRequest, res: Response) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('userId', 'firstName lastName email')
      .populate({ path: 'assignmentId', populate: { path: 'createdBy', select: 'firstName lastName email' } });

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Check if user has permission to view this submission
    if (req.user?.role !== 'admin' && 
        submission.userId.toString() !== req.user?._id.toString() && 
        (submission as any).assignmentId.createdBy._id.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this submission' });
    }

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Grade submission
// @route   PUT /api/submissions/:id
// @access  Private - Admin/Faculty
export const gradeSubmission = async (req: AuthRequest, res: Response) => {
  try {
    const { grade, feedback } = req.body;

    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    const assignment = await Assignment.findById(submission.assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if user has permission to grade this submission
    if (req.user?.role !== 'admin' && assignment.createdBy.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to grade this submission' });
    }

    const updatedSubmission = await Submission.findByIdAndUpdate(
      req.params.id,
      { grade, feedback },
      { new: true, runValidators: true }
    )
      .populate('userId', 'firstName lastName email')
      .populate({ path: 'assignmentId', populate: { path: 'createdBy', select: 'firstName lastName email' } });

    res.status(200).json({
      success: true,
      data: updatedSubmission
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};