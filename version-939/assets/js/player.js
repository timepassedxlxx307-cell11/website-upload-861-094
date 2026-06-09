(function () {
    function initializeMoviePlayer(options) {
        var video = document.getElementById(options.videoId);
        var button = document.getElementById(options.buttonId);
        var attached = false;
        var hls = null;

        if (!video || !button || !options.source) {
            return;
        }

        function attach() {
            if (attached) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = options.source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(options.source);
                hls.attachMedia(video);
            } else {
                video.src = options.source;
            }

            attached = true;
        }

        function play() {
            attach();
            button.classList.add('is-hidden');
            var promise = video.play();

            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    button.classList.remove('is-hidden');
                });
            }
        }

        button.addEventListener('click', play);

        video.addEventListener('click', function () {
            if (video.paused) {
                play();
            }
        });

        video.addEventListener('play', function () {
            button.classList.add('is-hidden');
        });

        video.addEventListener('pause', function () {
            if (!video.ended) {
                button.classList.remove('is-hidden');
            }
        });

        window.addEventListener('pagehide', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    }

    window.initializeMoviePlayer = initializeMoviePlayer;
}());
