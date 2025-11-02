<?php
// Comments API endpoints for blog posts and photos

// GET /api/comments/{contentType}/{contentId} - Get comments for specific content
function getComments($pdo, $contentType, $contentId) {
    try {
        // Get approved comments only (public view)
        $stmt = $pdo->prepare("
            SELECT Id, AuthorName, Content, CreatedDate 
            FROM Comments 
            WHERE ContentType = ? AND ContentId = ? AND IsApproved = TRUE 
            ORDER BY CreatedDate ASC
        ");
        $stmt->execute([$contentType, $contentId]);
        $comments = $stmt->fetchAll();
        
        // Convert field names to match React expectations (camelCase)
        $formattedComments = array_map(function($comment) {
            return [
                'id' => $comment['Id'],
                'authorName' => $comment['AuthorName'],
                'content' => $comment['Content'],
                'createdDate' => $comment['CreatedDate']
            ];
        }, $comments);
        
        echo json_encode($formattedComments);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error retrieving comments']);
    }
}

// GET /api/comments/pending - Get pending comments for admin moderation
function getPendingComments($pdo) {
    try {
        $stmt = $pdo->prepare("
            SELECT c.*, 
                   CASE 
                       WHEN c.ContentType = 'blog' THEN b.Title
                       WHEN c.ContentType = 'photo' THEN p.Caption
                   END as ContentTitle
            FROM Comments c
            LEFT JOIN BlogPosts b ON c.ContentType = 'blog' AND c.ContentId = b.Id
            LEFT JOIN Photos p ON c.ContentType = 'photo' AND c.ContentId = p.Id
            WHERE c.IsApproved = FALSE
            ORDER BY c.CreatedDate DESC
        ");
        $stmt->execute();
        $comments = $stmt->fetchAll();
        
        // Convert field names to match React expectations (camelCase)
        $formattedComments = array_map(function($comment) {
            return [
                'id' => $comment['Id'],
                'contentType' => $comment['ContentType'],
                'contentId' => $comment['ContentId'],
                'authorName' => $comment['AuthorName'],
                'authorEmail' => $comment['AuthorEmail'],
                'content' => $comment['Content'],
                'createdDate' => $comment['CreatedDate'],
                'isApproved' => $comment['IsApproved'],
                'contentTitle' => $comment['ContentTitle']
            ];
        }, $comments);
        
        echo json_encode($formattedComments);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error retrieving pending comments']);
    }
}

// POST /api/comments - Create new comment
function createComment($pdo) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (empty($input['contentType']) || empty($input['contentId']) || 
            empty($input['authorName']) || empty($input['content'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Content type, content ID, author name, and content are required']);
            return;
        }
        
        // Validate content type
        if (!in_array($input['contentType'], ['blog', 'photo'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid content type']);
            return;
        }
        
        // Basic spam protection - check for excessive length
        if (strlen($input['content']) > 1000) {
            http_response_code(400);
            echo json_encode(['error' => 'Comment too long (max 1000 characters)']);
            return;
        }
        
        // Check if the content exists
        $contentTable = $input['contentType'] === 'blog' ? 'BlogPosts' : 'Photos';
        $stmt = $pdo->prepare("SELECT Id FROM $contentTable WHERE Id = ?");
        $stmt->execute([$input['contentId']]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Content not found']);
            return;
        }
        
        // Insert comment (requires approval)
        $stmt = $pdo->prepare("
            INSERT INTO Comments (ContentType, ContentId, AuthorName, AuthorEmail, Content, CreatedDate, IsApproved) 
            VALUES (?, ?, ?, ?, ?, NOW(), FALSE)
        ");
        $stmt->execute([
            $input['contentType'],
            $input['contentId'],
            $input['authorName'],
            $input['authorEmail'] ?? null,
            $input['content']
        ]);
        
        http_response_code(201);
        echo json_encode([
            'message' => 'Comment submitted successfully and is pending approval',
            'id' => $pdo->lastInsertId()
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error creating comment']);
    }
}

// PUT /api/comments/{id}/approve - Approve a comment (admin only)
function approveComment($pdo, $id) {
    try {
        $stmt = $pdo->prepare("UPDATE Comments SET IsApproved = TRUE WHERE Id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Comment not found']);
            return;
        }
        
        http_response_code(200);
        echo json_encode(['message' => 'Comment approved successfully']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error approving comment']);
    }
}

// DELETE /api/comments/{id} - Delete a comment (admin only)
function deleteComment($pdo, $id) {
    try {
        $stmt = $pdo->prepare("DELETE FROM Comments WHERE Id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Comment not found']);
            return;
        }
        
        http_response_code(204);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error deleting comment']);
    }
}
?>