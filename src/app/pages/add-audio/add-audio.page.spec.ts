import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddAudioPage } from './add-audio.page';

describe('AddAudioPage', () => {
  let component: AddAudioPage;
  let fixture: ComponentFixture<AddAudioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAudioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddAudioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
