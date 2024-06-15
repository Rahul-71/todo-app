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

    public TodoEntity updateTodoItem(int todoId, TodoEntity todo) {
        try {
            Optional<TodoEntity> todoOptional = repository.findById(todoId);
            if (todoOptional.isPresent()) {
                System.out.println("todo patch operation present ....");
                TodoEntity existingTodo = todoOptional.get();
                // Update the fields of existingTodo with the fields of todo, if todo fields are
                // present
                if (todo.getTitle() != null)
                    existingTodo.setTitle(todo.getTitle());
                if (todo.getDescription() != null)
                    existingTodo.setDescription(todo.getDescription());

                Boolean completionStatus = todo.isCompletionStatus();
                // Code to handle if the return value is not null and is a boolean or Boolean
                if (completionStatus != null
                        && (completionStatus instanceof Boolean || completionStatus.getClass() == boolean.class)) {
                    existingTodo.setCompletionStatus(todo.isCompletionStatus());
                }

                // Update other fields as needed
                return repository.save(existingTodo);
                // return true;
            } else {
                return null;
            }
        } catch (Exception e) {
            // Handle any database-related exceptions here
            e.printStackTrace();
            return null;
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
