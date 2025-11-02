<?php
// Reactions API endpoints for emoji reactions on blog posts and photos

// GET /api/reactions/{contentType}/{contentId} - Get reaction counts for specific content
function getReactions($pdo, $contentType, $contentId) {
    try {
        $stmt = $pdo->prepare("
            SELECT ReactionType, COUNT(*) as Count 
            FROM Reactions 
            WHERE ContentType = ? AND ContentId = ? 
            GROUP BY ReactionType
            ORDER BY Count DESC
        ");
        $stmt->execute([$contentType, $contentId]);
        $reactions = $stmt->fetchAll();
        
        // Format as object with emoji as key and count as value
        $result = [];
        foreach ($reactions as $reaction) {
            $result[$reaction['ReactionType']] = (int)$reaction['Count'];
        }
        
        echo json_encode($result);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error retrieving reactions']);
    }
}

// GET /api/reactions/{contentType}/{contentId}/user/{userIdentifier} - Get user's reactions
function getUserReactions($pdo, $contentType, $contentId, $userIdentifier) {
    try {
        $stmt = $pdo->prepare("
            SELECT ReactionType 
            FROM Reactions 
            WHERE ContentType = ? AND ContentId = ? AND UserIdentifier = ?
        ");
        $stmt->execute([$contentType, $contentId, $userIdentifier]);
        $reactions = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        echo json_encode($reactions);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error retrieving user reactions']);
    }
}

// POST /api/reactions - Add or toggle a reaction
function toggleReaction($pdo) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (empty($input['contentType']) || empty($input['contentId']) || 
            empty($input['reactionType']) || empty($input['userIdentifier'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Content type, content ID, reaction type, and user identifier are required']);
            return;
        }
        
        // Validate content type
        if (!in_array($input['contentType'], ['blog', 'photo'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid content type']);
            return;
        }
        
        // Validate reaction type (common emojis)
        $allowedReactions = ['👍', '❤️', '😊', '😢', '😮', '😡', '🔥', '⭐', '🎉', '💯'];
        if (!in_array($input['reactionType'], $allowedReactions)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid reaction type']);
            return;
        }
        
        // Check if reaction already exists
        $stmt = $pdo->prepare("
            SELECT Id FROM Reactions 
            WHERE ContentType = ? AND ContentId = ? AND ReactionType = ? AND UserIdentifier = ?
        ");
        $stmt->execute([
            $input['contentType'],
            $input['contentId'],
            $input['reactionType'],
            $input['userIdentifier']
        ]);
        
        if ($stmt->fetch()) {
            // Reaction exists, remove it (toggle off)
            $stmt = $pdo->prepare("
                DELETE FROM Reactions 
                WHERE ContentType = ? AND ContentId = ? AND ReactionType = ? AND UserIdentifier = ?
            ");
            $stmt->execute([
                $input['contentType'],
                $input['contentId'],
                $input['reactionType'],
                $input['userIdentifier']
            ]);
            
            echo json_encode(['action' => 'removed', 'reactionType' => $input['reactionType']]);
        } else {
            // Reaction doesn't exist, add it
            $stmt = $pdo->prepare("
                INSERT INTO Reactions (ContentType, ContentId, ReactionType, UserIdentifier, CreatedDate) 
                VALUES (?, ?, ?, ?, NOW())
            ");
            $stmt->execute([
                $input['contentType'],
                $input['contentId'],
                $input['reactionType'],
                $input['userIdentifier']
            ]);
            
            echo json_encode(['action' => 'added', 'reactionType' => $input['reactionType']]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error toggling reaction']);
    }
}

// GET /api/reactions/summary - Get reaction summary for all content (admin)
function getReactionSummary($pdo) {
    try {
        $stmt = $pdo->prepare("
            SELECT 
                r.ContentType,
                r.ContentId,
                r.ReactionType,
                COUNT(*) as Count,
                CASE 
                    WHEN r.ContentType = 'blog' THEN b.Title
                    WHEN r.ContentType = 'photo' THEN p.Caption
                END as ContentTitle
            FROM Reactions r
            LEFT JOIN BlogPosts b ON r.ContentType = 'blog' AND r.ContentId = b.Id
            LEFT JOIN Photos p ON r.ContentType = 'photo' AND r.ContentId = p.Id
            GROUP BY r.ContentType, r.ContentId, r.ReactionType
            ORDER BY Count DESC
        ");
        $stmt->execute();
        $summary = $stmt->fetchAll();
        
        echo json_encode($summary);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error retrieving reaction summary']);
    }
}

// DELETE /api/reactions/{contentType}/{contentId} - Clear all reactions for content (admin)
function clearReactions($pdo, $contentType, $contentId) {
    try {
        $stmt = $pdo->prepare("DELETE FROM Reactions WHERE ContentType = ? AND ContentId = ?");
        $stmt->execute([$contentType, $contentId]);
        
        http_response_code(200);
        echo json_encode(['message' => 'All reactions cleared', 'deletedCount' => $stmt->rowCount()]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error clearing reactions']);
    }
}
?>