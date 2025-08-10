<?php

function getAuthor($id, $type) {
    if (!is_numeric($id)) {
        return null;
    }

    $db = new Database();
    $pdo = $db->getConnection();
    
    $query = match ($type) {
        0 => 'SELECT * FROM `accounts` WHERE `ID` = ?',
        1 => 'SELECT * FROM `channels` WHERE `ID` = ?'
    };
    $stmt = $pdo->prepare($query);
    $stmt->execute([$id]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    return $data;
}
