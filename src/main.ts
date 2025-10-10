import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

console.log('Bootstrapping Angular App...');

platformBrowserDynamic().bootstrapModule(AppModule);
