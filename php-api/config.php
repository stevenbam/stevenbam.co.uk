<?php
// Database configuration for Hostinger MySQL
// This replaces the appsettings.json from your C# project

$host = 'localhost';
$port = '3306';
$dbname = 'u128398700_stevenbam';
$username = 'u128398700_stevenbam';
$password = '$Aragorn60';

try {
    // Create PDO connection (PHP's way of connecting to MySQL)
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    // If connection fails, return error (like your C# try/catch blocks)
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// CORS headers - same as your C# CORS policy
header('Access-Control-Allow-Origin: https://stevenbam.co.uk');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle preflight OPTIONS requests (like your C# CORS does)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Create tables if they don't exist (like your C# EnsureCreated)
$createBlogPostsTable = "
CREATE TABLE IF NOT EXISTS BlogPosts (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(200) NOT NULL,
    Content TEXT NOT NULL,
    Author VARCHAR(100) NOT NULL,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME NULL,
    INDEX idx_created_date (CreatedDate)
)";

$createPhotosTable = "
CREATE TABLE IF NOT EXISTS Photos (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Caption VARCHAR(200) NOT NULL,
    FileName VARCHAR(255) NOT NULL,
    FilePath VARCHAR(255) NOT NULL,
    ContentType VARCHAR(100) NULL,
    FileSize BIGINT NOT NULL,
    UploadedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_uploaded_date (UploadedDate)
)";

$createCommentsTable = "
CREATE TABLE IF NOT EXISTS Comments (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ContentType ENUM('blog', 'photo') NOT NULL,
    ContentId INT NOT NULL,
    AuthorName VARCHAR(100) NOT NULL,
    AuthorEmail VARCHAR(255) NULL,
    Content TEXT NOT NULL,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    IsApproved BOOLEAN DEFAULT FALSE,
    INDEX idx_content (ContentType, ContentId),
    INDEX idx_created_date (CreatedDate)
)";

$createReactionsTable = "
CREATE TABLE IF NOT EXISTS Reactions (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ContentType ENUM('blog', 'photo') NOT NULL,
    ContentId INT NOT NULL,
    ReactionType VARCHAR(50) NOT NULL,
    UserIdentifier VARCHAR(255) NOT NULL,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_reaction (ContentType, ContentId, ReactionType, UserIdentifier),
    INDEX idx_content (ContentType, ContentId)
)";

$pdo->exec($createBlogPostsTable);
$pdo->exec($createPhotosTable);
$pdo->exec($createCommentsTable);
$pdo->exec($createReactionsTable);
?>