/login/

/user/

/patient/

/doctor/

POST create a new lease /lease/ created
201

PUT /lease/{lease_id}/require/ require a lease
200
410 Gone if expired or cancelled

PUT /lease/{lease_id}/ack/ ack a lease
200
410 Gone if expired or cancelled

PUT /lease/{lease_id}/cancel/ cancel a lease
200


