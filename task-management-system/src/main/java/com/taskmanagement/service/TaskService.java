package com.taskmanagement.service;

import com.taskmanagement.dto.TaskRequest;
import com.taskmanagement.dto.TaskResponse;
import com.taskmanagement.exception.ResourceNotFoundException;
import com.taskmanagement.model.Task;
import com.taskmanagement.model.TaskPriority;
import com.taskmanagement.model.TaskStatus;
import com.taskmanagement.model.User;
import com.taskmanagement.repository.TaskRepository;
import com.taskmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    
    @Transactional
    public TaskResponse createTask(TaskRequest request) {
        User currentUser = getCurrentUser();
        
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus() != null ? request.getStatus() : TaskStatus.NEW);
        task.setPriority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM);
        task.setDueDate(request.getDueDate());
        task.setCreatedBy(currentUser);
        
        if (request.getAssignedToId() != null) {
            User assignee = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
            task.setAssignedTo(assignee);
        }
        
        Task savedTask = taskRepository.save(task);
        return mapToResponse(savedTask);
    }
    
    public List<TaskResponse> getAllTasks() {
        User currentUser = getCurrentUser();
        List<Task> tasks = taskRepository.findByCreatedByIdOrAssignedToId(currentUser.getId(), currentUser.getId());
        return tasks.stream().map(this::mapToResponse).collect(Collectors.toList());
    }
    
    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        
        User currentUser = getCurrentUser();
        if (!task.getCreatedBy().getId().equals(currentUser.getId()) && 
            (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(currentUser.getId()))) {
            throw new RuntimeException("Access denied");
        }
        
        return mapToResponse(task);
    }
    
    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        
        User currentUser = getCurrentUser();
        if (!task.getCreatedBy().getId().equals(currentUser.getId()) && 
            (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(currentUser.getId()))) {
            throw new RuntimeException("Access denied");
        }
        
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        task.setDueDate(request.getDueDate());
        
        if (request.getAssignedToId() != null) {
            User assignee = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
            task.setAssignedTo(assignee);
        }
        
        Task updatedTask = taskRepository.save(task);
        return mapToResponse(updatedTask);
    }
    
    @Transactional
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        
        User currentUser = getCurrentUser();
        if (!task.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Only the creator can delete this task");
        }
        
        taskRepository.delete(task);
    }
    
    private TaskResponse mapToResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus());
        response.setPriority(task.getPriority());
        response.setCreatedById(task.getCreatedBy().getId());
        response.setCreatedByName(task.getCreatedBy().getUsername());
        
        if (task.getAssignedTo() != null) {
            response.setAssignedToId(task.getAssignedTo().getId());
            response.setAssignedToName(task.getAssignedTo().getUsername());
        }
        
        response.setCreatedDate(task.getCreatedDate());
        response.setUpdatedDate(task.getUpdatedDate());
        response.setDueDate(task.getDueDate());
        
        return response;
    }
}
