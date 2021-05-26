// Go through selected files and perform pre-processing.

function read_files(files) {
  explanationModal.style.display = "none"
  exploreModal.style.display = "none"
  processingModal.style.display = "block"

  var re = new RegExp('messages/.*message.*\.json');
  messages_array = []
  gtag('event', 'Load', {
      'event_category': 'Load',
      'event_label': 'Custom'})
  
  // Iterate through files
  for (var i=0; i < files.length; i++) {
    (function(file, i) {

      // Check file matches Reg Exp
      if (re.test(file.webkitRelativePath)) {

        // Create Reader
        count_init += 1
        var reader = new FileReader()

        // Define Reader Operations
        reader.onloadend = function() {
          
          thread = JSON.parse(reader.result)

          // Get Thread Metadata
          thread_info = {
            'is_still_participant': thread['is_still_participant'],
            'thread_type': thread['thread_type'],
            'thread': decodeURIComponent(escape(thread['title'])),
          }
          try {
            thread_info['nb_participants'] = thread['participants'].length
          } catch (err) {
            thread_info['nb_participants'] = 0
          }

          thread_messages = thread['messages']
          
          // Iterate through Messages
          for (var i=0; i < thread_messages.length; i++) {

            message = thread_messages[i]
            
            message_info = {
              'sender_name': decodeURIComponent(escape(message['sender_name'])),
              'timestamp': message['timestamp'] || (message['timestamp_ms'] / 1000),
              'type': message['type'],
            }

            if(message['photos'] != undefined){
              message_info['media'] = "Photo"
            }
            else if (message['videos'] != undefined){
              message_info['media'] = "Video"
            }
            else if(message['files'] != undefined){
              message_info['media'] = "File"
            }
            else {
              message_info['media'] = "None"
            }

            //
            try {
              message_info['message'] = decodeURIComponent(escape(message['content']))
            } catch (err) {
              message_info['message'] = ""
            }

            try {
              message_info['length'] = decodeURIComponent(escape(message['content'])).length
            } catch (err) {
              message_info['length'] = 0
            }

            // TODO: Fix this
            // if (message['reactions'].length == undefined) {
            //     message_info['reactions'] = 0
            // } else {
            //     message_info['reactions'] = 0
            // }

            // Save Message + Thread
            messages_array.push(Object.assign({}, message_info, thread_info));
          }

          // Count the number of files that were processsed up to the end
          count_end += 1

          // If all files were processed to the end, the launch main program
          if (count_init == count_end) {
            main()
          }
        }

        console.log('Hello')
        console.log(file)

        // Execute Reader
        reader.readAsText(file)
      }
    })(files[i], i);
  }
}
