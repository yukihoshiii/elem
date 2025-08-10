<?php

function Music ($params)
{
    global $Config;

    if (empty($params['sid'])) {
        exit();
    }

    $db = new Database();
    $pdo = $db->getConnection();

    $query = 'SELECT * FROM `songs` WHERE `ID` = ?';
    $stmt = $pdo->prepare($query);
    $stmt->execute([$params['sid']]);
    $song = $stmt->fetch(PDO::FETCH_ASSOC);

    if (empty($song)) {
        return 'Песня не найдена';
    }

    $metaTags = [
        '<meta charset="UTF-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
        '<meta property="og:site_name" content="Element">',
        '<meta property="og:title" content="' . htmlspecialchars($song['title'], ENT_QUOTES, 'UTF-8') . '">',
        '<meta property="og:description" content="' . htmlspecialchars($song['artist'], ENT_QUOTES, 'UTF-8') . '">'
    ];

    if (!empty($song['cover'])) {
        $cover = json_decode($song['cover'], true);
        if (!empty($cover['image'])) {
            $metaTags[] = '<meta property="og:image" content="'. $Config['CDN_URL'] .'/Content/Music/Covers/' . rawurlencode($cover['image']) . '">';
        }
    }

    echo '<!DOCTYPE html>
    <html lang="en">
    <head>' . implode("\n", $metaTags) . '
        <title>Музыка</title>
    </head>
    <body>
        <script>
            setTimeout(() => {
                window.location.href = "' . $Config['ELEMENT_URL'] . '/music/id/' . $song['id'] . '";
            }, 500);
        </script>
    </body>
    </html>';
}