const Note = require('../models/note.model.js');


exports.uploadFile = (req, res) => {
	let sampleFile;
	let uploadPath;

	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send({
            message: "Need to upload profile picture."
        });
	}

	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    const rndInt = Math.floor(Math.random() * 10000) + 1
	sampleFile 	= req.files.sampleFile;
	fileName 	= rndInt+sampleFile.name;
	uploadPath = __dirname + '\\..\\..\\public\\images\\' + fileName;

	// Use the mv() method to place the file somewhere on your server
	sampleFile.mv(uploadPath, function(err) {
        if (err){
			console.log(err);
			return res.status(500).send(err);
		}
		console.log('File uploaded successfully :) ');
		//res.send('File uploaded successfully :) ');
	});

    console.log('++++++'+fileName+'+++++++');
    return fileName;
}

// Create and Save a new Note
exports.create = (req, res) => {
    let fileName = this.uploadFile(req, res);

    // Validate request
    if(!req.body.content) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }
    
    // Create a Note
    const note = new Note({
        title: req.body.title || "Untitled Note", 
        content: req.body.content,
        fileName: fileName
    });

    // Save Note in the database
    note.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    Note.find()
    .then(notes => {
        res.send(notes);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};

// Find a single note with a noteId
exports.findOne = (req, res) => {
    Note.findById(req.params.noteId)
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });            
        }
        res.send(note);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving note with id " + req.params.noteId
        });
    });
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.content) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }

    // Find note and update it with the request body
    Note.findByIdAndUpdate(req.params.noteId, {
        title: req.body.title || "Untitled Note",
        content: req.body.content
    }, {new: true})
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        res.send(note);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });                
        }
        return res.status(500).send({
            message: "Error updating note with id " + req.params.noteId
        });
    });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    Note.findByIdAndRemove(req.params.noteId)
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        res.send({message: "Note deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.noteId
        });
    });
};
