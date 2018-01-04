import getConnection from '../../utils/db';


//get customers that can be messaged
//filters that can be used include:
//name, customer group(int), email, 
//sort(should use actual db column name for now, default is message_date), 
//order(ASC or DESC, default is ASC)

function getCustomers(filter){
	return new Promise((resolve, reject) => {
		getConnection((err, connection) => {
			var query = `SELECT *, CONCAT(c.firstname, ' ', c.lastname) AS name, cgd.name AS customer_group, 
							(
								SELECT msg.date_added FROM oc_msp_message msg 
								WHERE msg.customer_id=c.customer_id AND msg.hide_admin='0' 
								ORDER BY msg.date_added DESC LIMIT 0,1
							) AS message_date, 
							(
								SELECT count(*) FROM oc_msp_message msg 
								WHERE msg.customer_id=c.customer_id AND msg.read_status='0' 
								AND msg.sender='customer' AND msg.hide_admin='0'
							) AS total_message 
						FROM oc_customer c LEFT JOIN oc_customer_group_description cgd ON 
						(c.customer_group_id = cgd.customer_group_id) 
						WHERE cgd.language_id = 1 `;
			
			if(typeof filter.name!== 'undefined'){
		    	query = query + "AND CONCAT(c.firstname, '', c.lastname) LIKE '%" + filter.name + "%' ";
		    }

	    	if(typeof filter.customer_group !== 'undefined'){
		    	query = query + "AND c.customer_group_id = " + filter.customer_group + " ";
	    	}						

	    	if(typeof filter.email !== 'undefined'){
   				query = query + "AND c.email LIKE '%" + filter.email + "%' ";
			}

			if(typeof filter.sort !== 'undefined'){
				query = query + "ORDER BY " + filter.sort + " ";
			}
			else{
				query = query + "ORDER BY message_date "; 
			}
			
			if(typeof filter.order !== 'undefined'){
				query = query + filter.order + " ";
			}
			else{
				query = query + "DESC "; 
			}

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

