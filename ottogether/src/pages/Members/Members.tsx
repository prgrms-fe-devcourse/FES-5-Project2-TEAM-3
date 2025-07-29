import MemberCard from '../../components/member/MemberCard'
import S from './Members.module.css'

function Members() {
	return (
		<>
		<div className={S['section-header']}>
			<button>&lt;</button>
			<p>···</p>
			<div className={S["button-group"]}>
				<button className={S['first-btn']}>1</button>
				<button>2</button>
				<button>3</button>
				<button>4</button>
			</div>
			<p>···</p>
			<button>&gt;</button>
		</div>
		<div className={S.divider}></div>
		<MemberCard />
		</>
	)
}
export default Members