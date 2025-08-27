/**
 * Script to initialize Supabase Storage buckets
 * Run this once to set up the required storage buckets for media management
 */

import { supabase } from './client';
import { initializeStorageBuckets } from './storage';

export async function setupStorageBuckets() {
  console.log('Setting up Supabase Storage buckets...');
  
  try {
    await initializeStorageBuckets();
    console.log('✅ Storage buckets setup completed successfully!');
    
    // List all buckets to verify
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('❌ Error listing buckets:', error);
    } else {
      console.log('📦 Available buckets:');
      buckets.forEach(bucket => {
        console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error setting up storage buckets:', error);
    throw error;
  }
}

// For direct execution
if (require.main === module) {
  setupStorageBuckets()
    .then(() => {
      console.log('🎉 Setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Setup failed:', error);
      process.exit(1);
    });
}