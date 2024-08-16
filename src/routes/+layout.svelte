<script>
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import FirebaseApp from '$lib/components/firebase/FirebaseApp.svelte';
	import { initializeApp } from 'firebase/app';
	import { getAuth } from 'firebase/auth';
	import { getFirestore } from 'firebase/firestore';
	import { env } from '$env/dynamic/public';

	const app = initializeApp(
		{
			appId: env.PUBLIC_FIREBASE_APP_ID,
			databaseURL: env.PUBLIC_FIREBASE_DATABASE_URL,
			projectId: env.PUBLIC_FIREBASE_PROJECT_ID,
			authDomain: env.PUBLIC_FIREBASE_AUTH_DOMAIN,
			storageBucket: env.PUBLIC_FIREBASE_STORAGE_BUCKET,
			messagingSenderId: env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
			apiKey: env.PUBLIC_FIREBASE_API_KEY,
			measurementId: env.PUBLIC_FIREBASE_MEASUREMENT_ID
		},
		'Linear Clock'
	);
	const firestore = getFirestore(app);
	const auth = getAuth(app);
</script>

<ModeWatcher />
<FirebaseApp {auth} {firestore}>
	<slot />
</FirebaseApp>
