<?php
// Blog API endpoints - equivalent to your BlogController.cs
// Each function matches a method from your C# BlogController

// GET /api/blog - Get all blog posts (matches GetBlogPosts() in your C# controller)
function getAllBlogPosts($pdo) {
    try {
        // Same SQL query as your C# LINQ: OrderByDescending(p => p.CreatedDate)
        $stmt = $pdo->prepare("SELECT * FROM BlogPosts ORDER BY CreatedDate DESC");
        $stmt->execute();
        $posts = $stmt->fetchAll();
        
        // Return JSON response (like your C# Ok(posts))
        echo json_encode($posts);
    } catch (Exception $e) {
        // Error handling like your C# try/catch
        http_response_code(500);
        echo json_encode(['error' => 'Error retrieving blog posts']);
    }
}

// GET /api/blog/{id} - Get single blog post (matches GetBlogPost(int id) in your C# controller)
function getBlogPost($pdo, $id) {
    try {
        // Same as your C# FindAsync(id)
        $stmt = $pdo->prepare("SELECT * FROM BlogPosts WHERE Id = ?");
        $stmt->execute([$id]);
        $post = $stmt->fetch();
        
        if (!$post) {
            // Same as your C# NotFound()
            http_response_code(404);
            echo json_encode(['error' => 'Blog post not found']);
            return;
        }
        
        // Same as your C# Ok(blogPost)
        echo json_encode($post);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error retrieving blog post']);
    }
}

// POST /api/blog - Create new blog post (matches CreateBlogPost(BlogPost blogPost) in your C# controller)
function createBlogPost($pdo) {
    try {
        // Get JSON data from request body (like your C# model binding)
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields (like your C# ModelState.IsValid)
        if (empty($input['title']) || empty($input['content']) || empty($input['author'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Title, content, and author are required']);
            return;
        }
        
        // Insert into database (like your C# _context.BlogPosts.Add())
        $stmt = $pdo->prepare("
            INSERT INTO BlogPosts (Title, Content, Author, CreatedDate) 
            VALUES (?, ?, ?, NOW())
        ");
        $stmt->execute([
            $input['title'],
            $input['content'],
            $input['author']
        ]);
        
        // Get the created post (like your C# CreatedAtAction)
        $newId = $pdo->lastInsertId();
        $stmt = $pdo->prepare("SELECT * FROM BlogPosts WHERE Id = ?");
        $stmt->execute([$newId]);
        $newPost = $stmt->fetch();
        
        http_response_code(201);
        echo json_encode($newPost);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error creating blog post']);
    }
}

// PUT /api/blog/{id} - Update blog post (matches UpdateBlogPost(int id, BlogPost blogPost) in your C# controller)
function updateBlogPost($pdo, $id) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Check if post exists (like your C# FindAsync)
        $stmt = $pdo->prepare("SELECT * FROM BlogPosts WHERE Id = ?");
        $stmt->execute([$id]);
        $existingPost = $stmt->fetch();
        
        if (!$existingPost) {
            http_response_code(404);
            echo json_encode(['error' => 'Blog post not found']);
            return;
        }
        
        // Update the post (like your C# existingPost.Title = blogPost.Title)
        $stmt = $pdo->prepare("
            UPDATE BlogPosts 
            SET Title = ?, Content = ?, Author = ?, UpdatedDate = NOW() 
            WHERE Id = ?
        ");
        $stmt->execute([
            $input['title'] ?? $existingPost['Title'],
            $input['content'] ?? $existingPost['Content'],
            $input['author'] ?? $existingPost['Author'],
            $id
        ]);
        
        // Return success (like your C# NoContent())
        http_response_code(204);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error updating blog post']);
    }
}

// DELETE /api/blog/{id} - Delete blog post (matches DeleteBlogPost(int id) in your C# controller)
function deleteBlogPost($pdo, $id) {
    try {
        // Check if post exists (like your C# FindAsync)
        $stmt = $pdo->prepare("SELECT * FROM BlogPosts WHERE Id = ?");
        $stmt->execute([$id]);
        $post = $stmt->fetch();
        
        if (!$post) {
            http_response_code(404);
            echo json_encode(['error' => 'Blog post not found']);
            return;
        }
        
        // Delete the post (like your C# _context.BlogPosts.Remove())
        $stmt = $pdo->prepare("DELETE FROM BlogPosts WHERE Id = ?");
        $stmt->execute([$id]);
        
        // Return success (like your C# NoContent())
        http_response_code(204);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error deleting blog post']);
    }
}
?>