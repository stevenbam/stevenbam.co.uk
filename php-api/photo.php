<?php
// Photo API endpoints - equivalent to your PhotoController.cs
// Each function matches a method from your C# PhotoController

// GET /api/photo - Get all photos (matches GetPhotos() in your C# controller)
function getAllPhotos($pdo) {
    try {
        // Same SQL query as your C# LINQ: OrderByDescending(p => p.UploadedDate)
        $stmt = $pdo->prepare("SELECT * FROM Photos ORDER BY UploadedDate DESC");
        $stmt->execute();
        $photos = $stmt->fetchAll();
        
        // Return JSON response (like your C# Ok(photos))
        echo json_encode($photos);
    } catch (Exception $e) {
        // Error handling like your C# try/catch
        http_response_code(500);
        echo json_encode(['error' => 'Error retrieving photos']);
    }
}

// GET /api/photo/{id} - Get single photo metadata (matches GetPhoto(int id) in your C# controller)
function getPhoto($pdo, $id) {
    try {
        // Same as your C# FindAsync(id)
        $stmt = $pdo->prepare("SELECT * FROM Photos WHERE Id = ?");
        $stmt->execute([$id]);
        $photo = $stmt->fetch();
        
        if (!$photo) {
            // Same as your C# NotFound()
            http_response_code(404);
            echo json_encode(['error' => 'Photo not found']);
            return;
        }
        
        // Same as your C# Ok(photo)
        echo json_encode($photo);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error retrieving photo']);
    }
}

// GET /api/photo/{id}/file - Get actual photo file (matches GetPhotoFile(int id) in your C# controller)
function getPhotoFile($pdo, $id) {
    try {
        // Get photo metadata first
        $stmt = $pdo->prepare("SELECT * FROM Photos WHERE Id = ?");
        $stmt->execute([$id]);
        $photo = $stmt->fetch();
        
        if (!$photo) {
            http_response_code(404);
            echo json_encode(['error' => 'Photo not found']);
            return;
        }
        
        $filePath = $photo['FilePath'];
        
        // Check if file exists (like your C# File.Exists)
        if (!file_exists($filePath)) {
            http_response_code(404);
            echo json_encode(['error' => 'Photo file not found']);
            return;
        }
        
        // Set appropriate headers (like your C# File() return)
        header('Content-Type: ' . $photo['ContentType']);
        header('Content-Length: ' . $photo['FileSize']);
        header('Content-Disposition: inline; filename="' . $photo['FileName'] . '"');
        
        // Stream the file (like your C# FileStream)
        readfile($filePath);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error retrieving photo file']);
    }
}

// POST /api/photo - Upload new photo (matches UploadPhoto(IFormFile file, string caption) in your C# controller)
function uploadPhoto($pdo) {
    try {
        // Check if file was uploaded (like your C# file == null check)
        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['error' => 'No file uploaded or upload error']);
            return;
        }
        
        // Get caption from POST data (like your C# caption parameter)
        $caption = $_POST['caption'] ?? '';
        if (empty($caption)) {
            http_response_code(400);
            echo json_encode(['error' => 'Caption is required']);
            return;
        }
        
        $file = $_FILES['file'];
        $fileName = $file['name'];
        $fileSize = $file['size'];
        $fileTmpPath = $file['tmp_name'];
        $contentType = $file['type'];
        
        // Validate file type (like your C# content type validation)
        $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($contentType, $allowedTypes)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed']);
            return;
        }
        
        // Create uploads directory if it doesn't exist (like your C# Directory.CreateDirectory)
        $uploadsDir = 'uploads/';
        if (!is_dir($uploadsDir)) {
            mkdir($uploadsDir, 0755, true);
        }
        
        // Generate unique filename (like your C# Guid.NewGuid())
        $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);
        $uniqueFileName = uniqid() . '_' . time() . '.' . $fileExtension;
        $filePath = $uploadsDir . $uniqueFileName;
        
        // Move uploaded file (like your C# file.CopyTo())
        if (!move_uploaded_file($fileTmpPath, $filePath)) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save uploaded file']);
            return;
        }
        
        // Save to database (like your C# _context.Photos.Add())
        $stmt = $pdo->prepare("
            INSERT INTO Photos (Caption, FileName, FilePath, ContentType, FileSize, UploadedDate) 
            VALUES (?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([
            $caption,
            $fileName,
            $filePath,
            $contentType,
            $fileSize
        ]);
        
        // Get the created photo (like your C# CreatedAtAction)
        $newId = $pdo->lastInsertId();
        $stmt = $pdo->prepare("SELECT * FROM Photos WHERE Id = ?");
        $stmt->execute([$newId]);
        $newPhoto = $stmt->fetch();
        
        http_response_code(201);
        echo json_encode($newPhoto);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error uploading photo']);
    }
}

// DELETE /api/photo/{id} - Delete photo (matches DeletePhoto(int id) in your C# controller)
function deletePhoto($pdo, $id) {
    try {
        // Check if photo exists (like your C# FindAsync)
        $stmt = $pdo->prepare("SELECT * FROM Photos WHERE Id = ?");
        $stmt->execute([$id]);
        $photo = $stmt->fetch();
        
        if (!$photo) {
            http_response_code(404);
            echo json_encode(['error' => 'Photo not found']);
            return;
        }
        
        // Delete the file from filesystem (like your C# File.Delete)
        if (file_exists($photo['FilePath'])) {
            unlink($photo['FilePath']);
        }
        
        // Delete from database (like your C# _context.Photos.Remove())
        $stmt = $pdo->prepare("DELETE FROM Photos WHERE Id = ?");
        $stmt->execute([$id]);
        
        // Return success (like your C# NoContent())
        http_response_code(204);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error deleting photo']);
    }
}
?>