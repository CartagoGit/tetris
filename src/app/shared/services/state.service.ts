import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  concatMap,
  filter,
  interval,
  takeUntil,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  // ANCHOR : Properties
  public timer$ = new BehaviorSubject<string>(this.formatTime(0));
  private _time = 0;

  public score: number = 0;
  public level: number = 1;
  public lines: number = 0;

  public gameOver: boolean = false;
  public gameStart: boolean = false;
  public maxScore: number;

  public isPaused$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  public counter$: Observable<number> = this.isPaused$.pipe(
    filter((isPaused) => !isPaused),
    concatMap(() => interval(1000))
  );

  private _subscriptions: Subscription[] = [];

  // ANCHOR : Constructor
  constructor() {
    const maxScoreStorage = Number(localStorage.getItem('maxScore'));
    this.maxScore = isNaN(maxScoreStorage) ? 0 : maxScoreStorage;

    let subCounter = this.counter$.subscribe(() => {
      this._time++;
      this.timer$.next(this.formatTime(this._time));
      console.log({ timer: this.timer$.value, time: this._time });
    });
    const subIsPaused = this.isPaused$.subscribe((isPaused) => {
      if (isPaused && !subCounter.closed) subCounter.unsubscribe();
      else if (!isPaused) {
        subCounter.unsubscribe();
        subCounter = this.counter$.subscribe(() => {
          this._time++;
          this.timer$.next(this.formatTime(this._time));
          console.log({ timer: this.timer$.value, time: this._time });
        });
        this._subscriptions.push(subCounter);
      }
    });
    this._subscriptions.push(subIsPaused);
  }
  ngOnDestroy(): void {
    this._subscriptions.forEach((sub) => !sub.closed && sub.unsubscribe());
  }

  // ANCHOR : Methods

  public resetState(): void {
    if (this.score > this.maxScore) {
      localStorage.setItem('maxScore', this.score.toString());
      this.maxScore = this.score;
    }
    this._time = 0;
    this.timer$.next(this.formatTime(0));
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.gameOver = false;
    this.gameStart = false;
    this.isPaused$.next(true);
  }

  public startGame(): void {
    this.gameStart = true;
    this.isPaused$.next(false);
  }

  public formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${
      seconds < 10 ? '0' : ''
    }${seconds}`;
  }
}
