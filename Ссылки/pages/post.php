<?php

function Post($params)
{
    global $Config;

    if (empty($params['pid'])) {
        exit();
    }

    $db = new Database();
    $pdo = $db->getConnection();

    $query = 'SELECT * FROM `posts` WHERE `ID` = ?';
    $stmt = $pdo->prepare($query);
    $stmt->execute([$params['pid']]);
    $post = $stmt->fetch(PDO::FETCH_ASSOC);

    if (empty($post)) {
        return 'Пост не найден';
    }

    $authorData = getAuthor($post['TargetID'], $post['TargetType']);

    $metaTags = [
        '<meta charset="UTF-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
        '<meta property="og:site_name" content="Element">',
        '<meta property="og:title" content="Пост от ' . htmlspecialchars($authorData['Name'], ENT_QUOTES, 'UTF-8') . '">',
    ];

    if (!empty($post['Text'])) {
        $metaTags[] = '<meta property="og:description" content="' . htmlspecialchars($post['Text'], ENT_QUOTES, 'UTF-8') . '">';
    }

    if (!empty($post['Content'])) {
        $content = json_decode($post['Content'], true);
        if (!empty($content['Image']['file_name'])) {
            $metaTags[] = '<meta property="og:image" content="'. $Config['CDN_URL'] .'/Content/Posts/Images/' . rawurlencode($content['Image']['file_name']) . '">';
        }
    }

    echo '<!DOCTYPE html>
    <html lang="en">
    <head>' . implode("\n", $metaTags) . '
        <title>Пост</title>
    </head>
    <body>
        <script>
            setTimeout(() => {
                window.location.href = "' . $Config['ELEMENT_URL'] . '/post/' . $post['ID'] . '";
            }, 500);
        </script>
    </body>
    </html>';
}

?>
