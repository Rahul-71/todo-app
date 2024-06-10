package com.samplepoc.todo.todo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.samplepoc.todo.todo.model.TodoEntity;
import com.samplepoc.todo.todo.repository.TodoRepository;

@Service
public class TodoService {

    @Autowired
    private TodoRepository repository;

    public List<TodoEntity> getAllTodo() {
        List<TodoEntity> todos = repository.findAll();
        return todos;
    }

    public TodoEntity getTodoById(int id) {
        Optional<TodoEntity> todoOptional = repository.findById(id);

        return todoOptional.orElse(null);
    }

    public TodoEntity createTodoItem(TodoEntity todo) {
        try {
            return repository.save(todo);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public boolean updateTodoItem(int todoId, TodoEntity todo) {
        try {
            Optional<TodoEntity> todoOptional = repository.findById(todoId);
            if (todoOptional.isPresent()) {
                TodoEntity existingTodo = todoOptional.get();
                // Update the fields of existingTodo with the fields of todo
                existingTodo.setDescription(todo.getDescription());
                existingTodo.setCompletionStatus(todo.isCompletionStatus());
                // Update other fields as needed
                repository.save(existingTodo);
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            // Handle any database-related exceptions here
            e.printStackTrace();
            return false;
        }
    }

    public boolean deleteTodoById(int todoId) {
        try {
            Optional<TodoEntity> todoOptional = repository.findById(todoId);
            if (todoOptional.isPresent()) {
                repository.deleteById(todoId);
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
