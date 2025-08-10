<?php

header('Content-Type: text/html; charset=UTF-8');

require 'system/Config.php';
require 'system/Database.php';
require 'system/Function.php';
require 'vendor/autoload.php';
require 'pages/profile.php';
require 'pages/post.php';
require 'pages/music.php';

use FastRoute\RouteCollector;
use function FastRoute\simpleDispatcher;

$dispatcher = simpleDispatcher(function(RouteCollector $r) {
    $r->addRoute('GET', '/e/{username}', 'Profile');
    $r->addRoute('GET', '/post/{pid}', 'Post');
    $r->addRoute('GET', '/music/{sid}', 'Music');
});

$httpMethod = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

if (false !== $pos = strpos($uri, '?')) {
    $uri = substr($uri, 0, $pos);
}
$uri = rawurldecode($uri);

$routeInfo = $dispatcher->dispatch($httpMethod, $uri);
switch ($routeInfo[0]) {
    case FastRoute\Dispatcher::NOT_FOUND:
        echo '404 Not Found';
        break;
    case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
        echo '405 Method Not Allowed';
        break;
    case FastRoute\Dispatcher::FOUND:
        $handler = $routeInfo[1];
        $vars = $routeInfo[2];
        call_user_func($handler, $vars);
        break;
}