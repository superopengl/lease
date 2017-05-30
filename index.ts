import * as api from "./src/data/apis";
import * as dto from "./src/data/dtos";

async function main() {

	const patientUser: dto.User = {
		name: "Martin",
		password: "1234"
	};
	const doctorUser: dto.User = {
		name: "Doctor Zhang",
		password: "1234"
	};

	await api.user.create(patientUser);
	await api.user.create(doctorUser);

	const patient: dto.Patient = {
		user_id: patientUser.id,
		bio_info: {
			first_name: "Tong X",
			last_name: "X",
			dob: new Date(1960, 11, 4),
			gender: "male",
			blood_type: "B+"
		}
	};
	const doctor: dto.Doctor = {
		user_id: doctorUser.id,
		licenses: ["certificate US doctor"]
	};

	await api.patient.create(patient);
	await api.doctor.create(doctor);

	// const lease = await api.lease.createBy(patientUser);
	// lease.requireBy(doctorUser);
	// await api.lease.update("id", lease);
	// lease.acknowledgeBy(patientUser);
	// await api.lease.update("id", lease);

	console.log("Done");
}

main();
