import { DOCUMENT } from '@angular/common';
import { ToastService } from './../../services/toast.service';
import { StorageService } from './../../services/storage.service';
import { environment } from './../../../environments/environment.prod';
import { File } from '@ionic-native/file/ngx';
import { Platform, ModalController, DomController } from '@ionic/angular';
import { MediaObject, Media } from '@ionic-native/media/ngx';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-add-audio',
  templateUrl: './add-audio.page.html',
  styleUrls: ['./add-audio.page.scss']
})
export class AddAudioPage implements OnInit {
  isRecording = false;
  isRecorded = false;
  audioList: any[] = [];
  audioTitle = '';
  fileName: string;
  filePath: string;
  audio: MediaObject;
  duration = '00:00';
  timerCounter = 0;
  stopWatch: any;

  constructor(
    private platform: Platform,
    private file: File,
    private modalController: ModalController,
    private media: Media,
    private storage: StorageService,
    private toast: ToastService,
    @Inject(DOCUMENT) private document,
    private domController: DomController
  ) {}

  ngOnInit() {}

  startRecording() {
    this.fileName = 'lr_audio_' + new Date().getTime() + '.mp3';

    if (this.platform.is('ios')) {
      this.filePath =
        this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
    } else if (this.platform.is('android')) {
      this.filePath =
        this.file.externalDataDirectory.replace(/file:\/\//g, '') +
        this.fileName;
    }

    this.audio = this.media.create(this.filePath);
    this.audio.startRecord();
    this.toggleAnimation();
    this.isRecording = true;
    this.stopWatch = setInterval(this.startStopwatch.bind(this), 1000);
  }

  stopRecording() {
    this.audio.stopRecord();
    this.stopStopwatch();
    this.isRecording = false;
    this.isRecorded = true;
    this.toggleAnimation();
  }

  async saveAudio() {
    if (this.audioTitle.trim() === '') {
      this.toast.showToast('Provide a title for your audio file', 3000);
    } else {
      await this.storage.get(environment.audioStorage).then(
        data => {
          console.log('Save audio get res: ', data);
          this.audioList = data.length > 0 ? data : [];
          this.audioList.push({
            fileName: this.fileName,
            title: this.audioTitle
          });
        },
        err => {
          this.toast.showToast(
            'Error 1 saving the audio file. Please try again.',
            3000
          );
          this.resetStuff();
          return false;
        }
      );

      await this.storage
        .store(environment.audioStorage, this.audioList)
        .then(() => {
          this.toast.showToast(`Audio ${this.audioTitle} saved successfully.`);
          this.resetStuff();
        })
        .catch(err => {
          this.toast.showToast(
            'Error 2 saving the audio file. Please try again.',
            3000
          );
          this.resetStuff();
        });
    }
  }

  startStopwatch() {
    ++this.timerCounter;
    const m =
      Math.floor(this.timerCounter / 60) < 10
        ? '0' + Math.floor(this.timerCounter / 60)
        : Math.floor(this.timerCounter / 60);
    const s =
      Math.floor(this.timerCounter % 60) < 10
        ? '0' + Math.floor(this.timerCounter % 60)
        : Math.floor(this.timerCounter % 60);
    this.duration = m + ':' + s;
  }

  stopStopwatch() {
    clearInterval(this.stopWatch);
  }

  resetStuff() {
    this.isRecorded = false;
    this.isRecording = false;
    this.duration = '00:00';
    this.timerCounter = 0;
    this.audioTitle = '';
  }

  toggleAnimation() {
    this.domController.write(() => {
      this.document.querySelector('.duration-circle').classList.toggle('anim');
    });
  }

  async closeModal() {
    this.resetStuff();
    await this.modalController.dismiss();
  }
}
