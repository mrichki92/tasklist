import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as faceapi from 'face-api.js';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2>Liveness Verification</h2>

      <video #video autoplay muted></video>

      <div class="status">{{ status }}</div>

      <button (click)="start()" [disabled]="loading">
        {{ loading ? 'Loading Models...' : 'Start Verification' }}
      </button>
    </div>
  `,
  styles: [`
    :host {
      display:flex;
      justify-content:center;
      align-items:center;
      height:100vh;
      background: radial-gradient(circle at top, #0f172a, #020617);
      font-family: Arial, Helvetica, sans-serif;
    }

    .card {
      width:420px;
      padding:24px;
      border-radius:18px;
      background: rgba(15,23,42,.85);
      backdrop-filter: blur(12px);
      box-shadow:0 20px 50px rgba(0,0,0,.6);
      text-align:center;
      color:#e2e8f0;
    }

    video {
      width:100%;
      border-radius:14px;
      margin:14px 0;
      background:black;
      border:2px solid #1e293b;
    }

    .status {
      margin:10px 0 16px;
      font-weight:600;
      color:#38bdf8;
      min-height:24px;
    }

    button {
      width:100%;
      padding:12px;
      border-radius:12px;
      border:none;
      background:linear-gradient(135deg,#6366f1,#8b5cf6);
      color:white;
      font-size:15px;
      cursor:pointer;
    }

    button:disabled { opacity:.5 }
  `]
})
export class LivenessComponent implements OnInit {

  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;

  status = 'Loading AI...';
  loading = true;

  // Challenge Steps
  currentStep = 0;
  steps = ['smile', 'blink'];

  // Blink Detection Advanced
  blinkFrames = 0;
  blinkDetected = false;
  EAR_THRESHOLD = 0.28;
  BLINK_MIN_FRAMES = 1;

  async ngOnInit() {
    await this.loadModels();
  }

  speak(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    speechSynthesis.speak(utterance);
  }

  async loadModels() {
    const MODEL_URL = '/assets/models';
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    this.loading = false;
    this.status = 'Ready to start';
  }

  async start() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    this.videoRef.nativeElement.srcObject = stream;
    this.runChallenge();
  }

  runChallenge() {
    this.currentStep = 0;
    this.nextStep();
  }

  nextStep() {
    const step = this.steps[this.currentStep];

    if (step === 'smile') {
      this.status = 'Silakan tersenyum 😊';
      this.speak('Silakan tersenyum');
    }

    if (step === 'blink') {
      this.status = 'Sekarang kedipkan mata 👀';
      this.speak('Sekarang kedipkan mata');
    }

    this.detect(step);
  }

  // ===== EAR CALCULATION =====
  getEAR(eye: any) {
    const dist = (a: any, b: any) =>
      Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

    const A = dist(eye[1], eye[5]);
    const B = dist(eye[2], eye[4]);
    const C = dist(eye[0], eye[3]);

    return (A + B) / (2.0 * C);
  }

  detect(step: string) {
    const interval = setInterval(async () => {

      const detection = await faceapi
        .detectSingleFace(
          this.videoRef.nativeElement,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()
        .withFaceExpressions();

      if (!detection) return;

      // ===== SMILE DETECTION =====
      if (step === 'smile' && detection.expressions.happy > 0.7) {
        this.success(interval);
      }

      // ===== ADVANCED BLINK DETECTION =====
      if (step === 'blink') {

        const leftEye = detection.landmarks.getLeftEye();
        const rightEye = detection.landmarks.getRightEye();

        const leftEAR = this.getEAR(leftEye);
        const rightEAR = this.getEAR(rightEye);

        const ear = (leftEAR + rightEAR) / 2;

        console.log('EAR:', ear);

        // Mata tertutup
        if (ear < this.EAR_THRESHOLD) {
          this.blinkFrames++;
        } else {

          // Jika sebelumnya tertutup beberapa frame → blink valid
          if (this.blinkFrames >= this.BLINK_MIN_FRAMES) {
            this.success(interval);
          }

          this.blinkFrames = 0;
        }
      }

    }, 150); // Lebih smooth dari 800ms
  }

  success(interval: any) {
    clearInterval(interval);
    this.currentStep++;

    if (this.currentStep < this.steps.length) {
      setTimeout(() => this.nextStep(), 1200);
    } else {
      this.status = 'Verifikasi berhasil ✅';
      this.speak('Verifikasi berhasil');
    }
  }
}
