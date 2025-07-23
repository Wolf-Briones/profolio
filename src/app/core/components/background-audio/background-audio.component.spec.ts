import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundAudioComponent } from './background-audio.component';

describe('BackgroundAudioComponent', () => {
  let component: BackgroundAudioComponent;
  let fixture: ComponentFixture<BackgroundAudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundAudioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackgroundAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
