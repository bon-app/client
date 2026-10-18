import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestIonicModule } from '../testing/test-ionic.module';
import { TestBed } from '@angular/core/testing';
import { Platform } from '@ionic/angular/lazy';
import { vi } from 'vitest';
import { Capacitor } from '@capacitor/core';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  const ready = Promise.resolve();
  const platform = { ready: vi.fn(() => ready) };

  beforeEach(async () => {
    vi.spyOn(Capacitor, 'isNativePlatform').mockReturnValue(false);
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [TestIonicModule],
      declarations: [AppComponent],
      providers: [{ provide: Platform, useValue: platform }],
    }).compileComponents();
  });

  afterEach(() => vi.restoreAllMocks());

  it('waits for the Ionic platform to become ready', async () => {
    TestBed.createComponent(AppComponent);
    expect(platform.ready).toHaveBeenCalled();
    await ready;
  });
});
