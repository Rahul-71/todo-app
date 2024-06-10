package com.samplepoc.todo.todo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.samplepoc.todo.todo.model.TodoEntity;
import com.samplepoc.todo.todo.service.TodoService;

@RestController
@RequestMapping("/app/")
public class TodoController {

    @Autowired
    private TodoService service;

    /*
     * GET /todos (retrieve all todos)
     * GET /todos/{id} (retrieve a single todo)
     * POST /todos (create a todo)
     * PATCH /todos/{id} (update a todo)
     * DELETE /todos/{id} (delete a todo)
     */

    @GetMapping("/todos")
    public ResponseEntity<List<TodoEntity>> getTodos() {
        List<TodoEntity> todos = this.service.getAllTodo();
        if (todos != null) {
            return new ResponseEntity<>(todos, HttpStatus.OK);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/todo/{id}")
    public ResponseEntity<?> getTodoById(@PathVariable Integer id) {
        TodoEntity todo = this.service.getTodoById(id);
        ResponseEntity<?> response;
        if (todo != null) {
            response = ResponseEntity.ok().body(todo);
        } else {
            String errorMessage = "Item with id: " + id + " not found";
            response = ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }
        return response;
    }
    
    @PostMapping("/todo")
    public ResponseEntity<?> createTodo(@RequestBody TodoEntity todoRequest) {
        TodoEntity todoItem = this.service.createTodoItem(todoRequest);
        if (todoItem != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(todoItem);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create todo item.");
        }
    }
    
    @PatchMapping("/todos/{id}")
    public ResponseEntity<?> updateTodo(@PathVariable Integer id, @RequestBody TodoEntity todoRequest) {
        boolean updated = this.service.updateTodoItem(id, todoRequest);
        if (updated) {
            return ResponseEntity.ok().body("Todo item updated successfully.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/todos/{id}")
    public ResponseEntity<?> deleteTodo(@PathVariable Integer id) {
        boolean deleted = this.service.deleteTodoById(id);
        if (deleted) {
            Map<String, String> response = Map.ofEntries(
                Map.entry("status", "true"),
                Map.entry("description", "Item with id: " + id + " got deleted successfully.")
            );
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    

}
