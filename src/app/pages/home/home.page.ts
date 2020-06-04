import { ToastService } from './../../services/toast.service';
import { StorageService } from './../../services/storage.service';
import { ThemeService } from './../../services/theme.service';
import { AddAudioPage } from './../add-audio/add-audio.page';
import { environment } from './../../../environments/environment.prod';
import { Platform, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  isRecording = false;
  audioList = [];
  audioTitle: string;
  fileName: string;
  filePath: string;
  audio: MediaObject;
  isDark = false;
  subscription: any;

  constructor(
    private media: Media,
    private file: File,
    private platform: Platform,
    private modalController: ModalController,
    private themeService: ThemeService,
    private storageService: StorageService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadAudioFiles();
  }

  ionViewWillEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      // tslint:disable-next-line: no-string-literal
      navigator['app'].exitApp();
    });
    this.loadAudioFiles();
    console.log('Enter...');
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  async loadAudioFiles() {
    await this.storageService
      .get(environment.audioStorage)
      .then((data) => {
        console.log('Load Audio Data: ', data);
        if (data) {
          this.audioList = data;
        }
      })
      .catch((err) => {
        console.log('Error loading the audio list: ', err);
      });
  }

  async addAudio() {
    const modal = await this.modalController.create({
      component: AddAudioPage,
    });

    modal.onDidDismiss().then(() => {
      this.loadAudioFiles();
    });

    return await modal.present();
  }

  playAudio(fileName: any) {
    let filePath: string;

    if (this.platform.is('ios')) {
      filePath =
        this.file.documentsDirectory.replace(/file:\/\//g, '') + fileName;
    } else if (this.platform.is('android')) {
      filePath =
        this.file.externalDataDirectory.replace(/file:\/\//g, '') + fileName;
    }

    this.audio = this.media.create(filePath);
    this.audio.play();
    this.audio.setVolume(1);
  }

  async deleteAudio(audio: any) {
    console.log(audio);
    let filePath: string;

    if (this.platform.is('ios')) {
      filePath = this.file.documentsDirectory.replace(/file:\/\//g, '');
    } else if (this.platform.is('android')) {
      filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '');
    }

    console.log('Filepath: ', filePath);

    await this.file
      .removeFile(filePath, audio.fileName)
      .then(async (res: any) => {
        console.log('removeFile response: ', res);
        if (res) {
          this.audioList = this.audioList.filter(
            (resAudio) => resAudio.fileName !== audio.fileName
          );
          await this.storageService
            .store(environment.audioStorage, this.audioList)
            .then(() => {
              this.toast.showToast(
                `Audio ${audio.title} deleted successfully.`
              );
              this.loadAudioFiles();
            })
            .catch((err) => {
              this.toast.showToast(
                'Error deleting the audio file. Please try again.',
                3000
              );
            });
        }
      })
      .catch((err) => {
        console.log('Audio delete error: ', err);
        this.toast.showToast(
          'Error deleting the audio file. Please try again.',
          3000
        );
      });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.isDark = !this.isDark;
  }
}
