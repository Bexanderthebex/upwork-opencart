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

//assume that user_id is sender_id when sender is admin
//but when sender is customer, user_id is 0
//works for now, but needed to be fixed once sessions are live
function sendMessagetoCustomer(sender_id , recipient_id, message){
	return new Promise((resolve, reject) => {
		getConnection((err, connection) => {
			var query = `INSERT INTO oc_msp_message SET user_id = `+ sender_id + `, customer_id = ` + recipient_id + `, message = '`+ message + `', sender = 'user', date_added = NOW()`;
			console.log(query);
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


//get messages from a certain customer
function getMessagesfromCustomer(id){
	return new Promise((resolve, reject) => {
		getConnection((err, connection) => {
			var query = 'SELECT * FROM oc_msp_message WHERE customer_id = '+ id + ' AND hide_admin=0 ORDER BY date_added DESC';

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

function deleteMessagesfromCustomer(id){
	return new Promise((resolve, reject) => {
		getConnection((err, connection) => {
			var query = `UPDATE oc_msp_message SET hide_admin=1 WHERE customer_id=`+ id + ` `;

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
	deleteMessagesfromCustomer,

}

