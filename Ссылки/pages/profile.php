<?php

function Profile($params)
{
    global $Config;

    if (empty($params['username'])) {
        exit();
    }

    $db = new Database();
    $pdo = $db->getConnection();

    $query = 'SELECT * FROM `accounts` WHERE `Username` = ?';
    $stmt = $pdo->prepare($query);
    $stmt->execute([$params['username']]);
    $profile = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$profile) {
        $query = 'SELECT * FROM `channels` WHERE `Username` = ?';
        $stmt = $pdo->prepare($query);
        $stmt->execute([$params['username']]);
        $profile = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    if (!$profile) {
        exit();
    }

    $html = '
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta property="og:site_name" content="Element">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta property="og:title" content="'.$profile['Name'].' в Element">';
    if ($profile['Description']) {
        $html .= '<meta property="og:description" content="'.$profile['Description'].'">';
    }
    if ($profile['Avatar'] != 'None') {
        $html .= '<meta property="og:image" content="'. $Config['CDN_URL'] .'/Content/Avatars/'.$profile['Avatar'].'">';
    }
    $html .= '
    <title>Профиль</title>
    </head>
    <body>
    <script>
        setTimeout(function() {
            window.location.href = "'.$Config['ELEMENT_URL'].'/e/'.$profile['Username'].'";
        }, 1000);
    </script>
    </body>
    </html>
    ';
    echo $html;
}
