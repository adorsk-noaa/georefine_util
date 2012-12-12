config = {
    'CACHE_DIR': 'cache',
    'TARGET_DIR': 'assets/js'
}

assets = {
    'jquery.js': {
        'type': 'url',
        'source': 'https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js'
    },
    'less.js': {
        'type': 'git',
        'source': 'https://github.com/adorsk/less.js.git'
    },
    'require.js': {
        'type': 'git',
        'source': 'https://github.com/jrburke/requirejs.git',
        'path': 'require.js'
    },
    'rless.js': {
        'type': 'git',
        'source': 'https://github.com/adorsk/requirejs-less.git',
        'path': 'requirejs-less.js'
    },
    'requirejs-text.js': {
        'type': 'git',
        'source': 'https://github.com/requirejs/text.git',
        'path': 'text.js'
    },
    'jquery.qtip': {
        'type': 'git',
        'source': 'https://github.com/Craga89/qTip2.git',
        'path': 'dist'
    },
}
