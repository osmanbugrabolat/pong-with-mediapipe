const videoElement = document.querySelector('.input_video');
const cameraCanvas = document.querySelector('.camera_canvas');
const cameraCtx = cameraCanvas.getContext('2d');
const loadingText = document.getElementById('loading-text');
const startBtn = document.getElementById('start-btn');
const btnLeftTeam = document.getElementById('btn-left-team');
const btnRightTeam = document.getElementById('btn-right-team');

window.playerPaddleY = 250;
window.trackerReady = false;
window.playerSide = 'left';

btnLeftTeam.addEventListener('click', () => {
    window.playerSide = 'left';
    btnLeftTeam.classList.add('selected');
    btnRightTeam.classList.remove('selected');
});

btnRightTeam.addEventListener('click', () => {
    window.playerSide = 'right';
    btnRightTeam.classList.add('selected');
    btnLeftTeam.classList.remove('selected');
});

function onResults(results) {
    // Draw the camera feed and landmarks to the small canvas
    cameraCtx.save();
    cameraCtx.clearRect(0, 0, cameraCanvas.width, cameraCanvas.height);
    cameraCtx.drawImage(results.image, 0, 0, cameraCanvas.width, cameraCanvas.height);
    
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(cameraCtx, landmarks, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 2});
            drawLandmarks(cameraCtx, landmarks, {color: '#FF0000', lineWidth: 1, radius: 2});
        }
    }
    cameraCtx.restore();

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        let targetHandIndex = -1;
        
        // Find the hand that matches the chosen side
        for (let i = 0; i < results.multiHandedness.length; i++) {
            let label = results.multiHandedness[i].label.toLowerCase(); // 'left' or 'right'
            // Kameralar ayna görevi gördüğü için Mediapipe fiziksel Sol eli "Right" olarak, Sağ eli "Left" olarak etiketler.
            let expectedLabel = window.playerSide === 'left' ? 'right' : 'left';
            if (label === expectedLabel) {
                targetHandIndex = i;
                break;
            }
        }
        
        if (targetHandIndex !== -1) {
            const landmarks = results.multiHandLandmarks[targetHandIndex];
            // Use landmark 9 (middle finger MCP) to track the center of the hand
            const handCenter = landmarks[9];
            
            // y is normalized between 0.0 and 1.0. Map it to canvas height (500)
            window.playerPaddleY = handCenter.y * 500;
        }
    }
}

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.6,
  minTrackingConfidence: 0.6
});

hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
    
    if (!window.trackerReady) {
        window.trackerReady = true;
        loadingText.style.display = 'none';
        startBtn.disabled = false;
        startBtn.innerText = 'OYUNA BAŞLA';
    }
  },
  width: 640,
  height: 480
});

// Try to start the camera (will prompt user for permissions)
camera.start().catch(err => {
    console.error("Camera access denied or failed", err);
    loadingText.innerText = "Camera access is required to play!";
    loadingText.style.color = "#ff3366";
});
