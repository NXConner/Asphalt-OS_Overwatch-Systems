
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Plus, Edit, BookOpen, Award, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TrainingCourse {
  id: string;
  title: string;
  description?: string;
  category: string;
  duration?: number;
  format: string;
  isRequired: boolean;
  hasAssessment: boolean;
  passingScore?: number;
  isActive: boolean;
}

interface TrainingAssignment {
  id: string;
  userId: string;
  courseId: string;
  assignedDate: string;
  dueDate?: string;
  status: string;
  startedDate?: string;
  completedDate?: string;
  assessmentScore?: number;
  passed: boolean;
  course: TrainingCourse;
}

export function TrainingManagement() {
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [assignments, setAssignments] = useState<TrainingAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCourseDialog, setShowCourseDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/training/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await fetch('/api/training/assignments');
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const handleSaveCourse = async (courseData: Partial<TrainingCourse>) => {
    try {
      const url = selectedCourse ? `/api/training/courses/${selectedCourse.id}` : '/api/training/courses';
      const method = selectedCourse ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) throw new Error('Failed to save course');

      toast.success(selectedCourse ? 'Course updated' : 'Course created');
      fetchCourses();
      setShowCourseDialog(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error('Failed to save course');
    }
  };

  const handleAssignCourse = async (assignmentData: any) => {
    try {
      const response = await fetch('/api/training/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignmentData),
      });

      if (!response.ok) throw new Error('Failed to assign course');

      toast.success('Course assigned successfully');
      fetchAssignments();
      setShowAssignDialog(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error('Error assigning course:', error);
      toast.error('Failed to assign course');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { className: string; icon: any } } = {
      NOT_STARTED: { className: 'bg-gray-100 text-gray-800', icon: AlertCircle },
      IN_PROGRESS: { className: 'bg-blue-100 text-blue-800', icon: Clock },
      COMPLETED: { className: 'bg-green-100 text-green-800', icon: CheckCircle },
      FAILED: { className: 'bg-red-100 text-red-800', icon: XCircle },
      OVERDUE: { className: 'bg-orange-100 text-orange-800', icon: AlertCircle },
    };

    const config = statusConfig[status] || statusConfig.NOT_STARTED;
    const Icon = config.icon;

    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: any } = {
      SAFETY: '🦺',
      TECHNICAL: '🔧',
      EQUIPMENT_OPERATION: '⚙️',
      CUSTOMER_SERVICE: '💬',
      LEADERSHIP: '👥',
      COMPLIANCE: '📋',
      HEALTH: '❤️',
      ONBOARDING: '👋',
      OTHER: '📚',
    };
    return icons[category] || '📚';
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredAssignments = assignments.filter(assignment => {
    return filterStatus === 'all' || assignment.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Training & Development</h2>
          <p className="text-muted-foreground">Manage courses and employee training</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fetchCourses()}>
            <BookOpen className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => {
            setSelectedCourse(null);
            setShowCourseDialog(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="SAFETY">Safety</SelectItem>
            <SelectItem value="TECHNICAL">Technical</SelectItem>
            <SelectItem value="EQUIPMENT_OPERATION">Equipment Operation</SelectItem>
            <SelectItem value="CUSTOMER_SERVICE">Customer Service</SelectItem>
            <SelectItem value="LEADERSHIP">Leadership</SelectItem>
            <SelectItem value="COMPLIANCE">Compliance</SelectItem>
            <SelectItem value="HEALTH">Health</SelectItem>
            <SelectItem value="ONBOARDING">Onboarding</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="courses" className="w-full">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getCategoryIcon(course.category)}</span>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {course.category.replace('_', ' ')}
                      </p>
                    </div>
                    {course.isRequired && (
                      <Badge variant="outline" className="ml-2">Required</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {course.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>
                  )}

                  <div className="space-y-1 text-sm">
                    {course.duration && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{course.duration} minutes</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{course.format.replace('_', ' ')}</span>
                    </div>
                    {course.hasAssessment && (
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span>Passing: {course.passingScore}%</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowCourseDialog(true);
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowAssignDialog(true);
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Assign
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignments</SelectItem>
                <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredAssignments.map((assignment) => (
                  <div key={assignment.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{assignment.course.title}</h4>
                          {getStatusBadge(assignment.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Assigned: {new Date(assignment.assignedDate).toLocaleDateString()}
                        </p>
                        {assignment.dueDate && (
                          <p className="text-sm text-muted-foreground">
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </p>
                        )}
                        {assignment.completedDate && (
                          <p className="text-sm text-green-600">
                            Completed: {new Date(assignment.completedDate).toLocaleDateString()}
                          </p>
                        )}
                        {assignment.assessmentScore !== null && (
                          <p className="text-sm">
                            Score: {assignment.assessmentScore}% 
                            {assignment.passed ? ' ✓' : ' ✗'}
                          </p>
                        )}
                      </div>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Progress Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Completion</span>
                    <span className="text-sm text-muted-foreground">
                      {assignments.filter(a => a.status === 'COMPLETED').length} / {assignments.length}
                    </span>
                  </div>
                  <Progress 
                    value={(assignments.filter(a => a.status === 'COMPLETED').length / assignments.length) * 100} 
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-blue-600">
                        {assignments.filter(a => a.status === 'IN_PROGRESS').length}
                      </div>
                      <p className="text-sm text-muted-foreground">In Progress</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-green-600">
                        {assignments.filter(a => a.status === 'COMPLETED').length}
                      </div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-orange-600">
                        {assignments.filter(a => a.status === 'OVERDUE').length}
                      </div>
                      <p className="text-sm text-muted-foreground">Overdue</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-gray-600">
                        {assignments.filter(a => a.status === 'NOT_STARTED').length}
                      </div>
                      <p className="text-sm text-muted-foreground">Not Started</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Course Dialog */}
      <CourseDialog
        open={showCourseDialog}
        onOpenChange={setShowCourseDialog}
        course={selectedCourse}
        onSave={handleSaveCourse}
      />

      {/* Assign Dialog */}
      <AssignDialog
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        course={selectedCourse}
        onAssign={handleAssignCourse}
      />
    </div>
  );
}

function CourseDialog({
  open,
  onOpenChange,
  course,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: TrainingCourse | null;
  onSave: (data: Partial<TrainingCourse>) => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'SAFETY',
    duration: '',
    format: 'IN_PERSON',
    isRequired: false,
    hasAssessment: false,
    passingScore: '80',
    isActive: true,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{course ? 'Edit Course' : 'Create Course'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Course Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Safety Equipment Operation"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Course description..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAFETY">Safety</SelectItem>
                  <SelectItem value="TECHNICAL">Technical</SelectItem>
                  <SelectItem value="EQUIPMENT_OPERATION">Equipment Operation</SelectItem>
                  <SelectItem value="CUSTOMER_SERVICE">Customer Service</SelectItem>
                  <SelectItem value="LEADERSHIP">Leadership</SelectItem>
                  <SelectItem value="COMPLIANCE">Compliance</SelectItem>
                  <SelectItem value="HEALTH">Health</SelectItem>
                  <SelectItem value="ONBOARDING">Onboarding</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Format</Label>
              <Select value={formData.format} onValueChange={(value) => setFormData({ ...formData, format: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN_PERSON">In Person</SelectItem>
                  <SelectItem value="ONLINE">Online</SelectItem>
                  <SelectItem value="VIDEO">Video</SelectItem>
                  <SelectItem value="DOCUMENT">Document</SelectItem>
                  <SelectItem value="HANDS_ON">Hands On</SelectItem>
                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="60"
              />
            </div>

            <div className="space-y-2">
              <Label>Passing Score (%)</Label>
              <Input
                type="number"
                value={formData.passingScore}
                onChange={(e) => setFormData({ ...formData, passingScore: e.target.value })}
                placeholder="80"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isRequired"
                checked={formData.isRequired}
                onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isRequired" className="cursor-pointer">
                Required Course
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasAssessment"
                checked={formData.hasAssessment}
                onChange={(e) => setFormData({ ...formData, hasAssessment: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="hasAssessment" className="cursor-pointer">
                Has Assessment
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Active
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            onSave({
              ...formData,
              duration: parseInt(formData.duration) || undefined,
              passingScore: parseInt(formData.passingScore) || undefined,
            });
          }}>
            {course ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AssignDialog({
  open,
  onOpenChange,
  course,
  onAssign,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: TrainingCourse | null;
  onAssign: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    userId: '',
    dueDate: '',
    notes: '',
  });

  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Course</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-medium">{course.title}</h4>
            <p className="text-sm text-muted-foreground">{course.category.replace('_', ' ')}</p>
          </div>

          <div className="space-y-2">
            <Label>Employee *</Label>
            <Select value={formData.userId} onValueChange={(value) => setFormData({ ...formData, userId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user1">John Doe</SelectItem>
                <SelectItem value="user2">Jane Smith</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onAssign({
                courseId: course.id,
                ...formData,
                assignedDate: new Date().toISOString(),
              });
            }}
            disabled={!formData.userId}
          >
            Assign Course
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
