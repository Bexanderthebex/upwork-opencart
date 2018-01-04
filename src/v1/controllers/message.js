import getConnection from '../../utils/db';

function getCustomers(filter){
	return new Promise((resolve, reject) => {
		getConnection((err, connection) => {
			var query = '';
			connection.query(query, (err, result) => {
		        if (err) {
		          console.log(err);
		          reject(err);
		        }
		        connection.release();
		        resolve(result);
		    });
		});
	});
}

function sendMessagetoCustomer(id, message){
	return new Promise((resolve, reject) => {
		getConnection((err, connection) => {
			var query = '';
			connection.query(query, (err, result) => {
		        if (err) {
		          console.log(err);
		          reject(err);
		        }
		        connection.release();
		        resolve(result);
		    });
		});
	});
}

function getMessagesfromCustomer(id){
	return new Promise((resolve, reject) => {
		getConnection((err, connection) => {
			var query = '';

			connection.query(query, (err, result) => {
		        if (err) {
		          console.log(err);
		          reject(err);
		        }
		        connection.release();
		        resolve(result);
		    });
		});
	});
}

function deleteMesssagesfromCustomer(id){
	return new Promise((resolve, reject) => {
		getConnection((err, connection) => {
			var query = '';

			connection.query(query, (err, result) => {
		        if (err) {
		          console.log(err);
		          reject(err);
		        }
		        connection.release();
		        resolve(result);
		    });
		});
	});
}




export default {
	getCustomers,
	getMessagesfromCustomer,
	sendMessagetoCustomer,
	deleteMesssagesfromCustomer,

}

